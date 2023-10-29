import api from './APIClient.js';

// Ideas used from https://css-tricks.com/how-to-create-actions-for-selected-text-with-the-selection-api/, https://developer.mozilla.org/en-US/docs/Web/API/Selection, and https://stackoverflow.com/questions/29257428/contenteditable-div-cursor-position-in-terms-of-innerhtml-position

window.addEventListener('DOMContentLoaded', () => {

    // Input form for the document title. 
    const titleInput = document.querySelector("#noteTitleInput");

    //Input form for the document subtitle.
    const subtitleInput = document.querySelector("#noteSubtitleInput");

    // Font color input element
    const colorInput = document.querySelector("#colorSelector");

    // Element for the div with all the note information
    const notes = document.querySelector("#userNotesDiv");

    // Element with the base tag with the content
    const base = document.querySelector("#p1");

    // Font highlight input element
    const highlightInput = document.querySelector("#highlightSelector");

    // Save Button
    const saveInp = document.querySelector("#saveButton");

    // Save and Exit Button
    const saveAndExitInp = document.querySelector("#saveAndExitButton");

    // Exit Button
    const exitInp = document.querySelector("#exitButton");

    // Handles getting information from the page id
    const query = window.location.search;
    let parameters = new URLSearchParams(query);
    let id = parameters.get('id');
    api.getCurrentUser().then(
        (currentUser) => {
            if (currentUser) {
                api.getNoteById(id).then(
                    (useNote) => {
                        if (useNote) {
                            console.log(useNote);
                            titleInput.value = useNote.name;
                            subtitleInput.value = useNote.sub_name;
                            if (useNote.dataString != "") {
                                notes.innerHTML = useNote.dataString;
                            }
                        }
                    }
                );
            }
        }    
    );

    // Modal Content
    var control = document.importNode(document.querySelector('template').content, true).childNodes[0];
    control.addEventListener('click', oncontroldown, true);

    var mod = document.getElementById("colorPickModal");

    const col2 = document.querySelector("#newCol");

    // Because the document title is a required value, it has a custom validity associated with it.
    titleInput.addEventListener("input", (e) => {
        if (!titleInput.value) {
            titleInput.setCustomValidity("Please give your note page a name.");
        } else {
            titleInput.setCustomValidity("");
        }
    });

    // Handles font color input
    colorInput.addEventListener("change", (e) => {
        let selection = document.getSelection();
        let pos;

        if (selection.anchorNode == null) {
            pos = base.innerText.length;
        } else {
            pos = selection.getRangeAt(0).startOffset;
        }

        let text = selection.toString();
        if (text !== "") {
            let len = selection.getRangeAt(0).endOffset - selection.getRangeAt(0).startOffset;

            let t1 = document.createTextNode("\u0001");
            selection.getRangeAt(0).insertNode(t1);
            let start = base.innerHTML.indexOf("\u0001");
            t1.parentNode.removeChild(t1);

            let end = start + (len);
            base.innerHTML = base.innerHTML.substring(0, start) + "<span style=\"color:"+ colorInput.value + "\">" + base.innerHTML.substring(start, end) + "</span>"  + base.innerHTML.substring(end, base.innerHTML.length);
        } else if (text === "" && pos != base.innerText.length) {
            let target = document.createTextNode("\u0001");
            document.getSelection().getRangeAt(0).insertNode(target);
            let start = base.innerHTML.indexOf("\u0001");
            target.parentNode.removeChild(target);
            base.innerHTML = base.innerHTML.substring(0, start) + "<span style=\"color:"+ colorInput.value + "\"> _ </span>" + base.innerHTML.substring(start, base.innerHTML.length);
        } else {
            base.innerHTML += "<span style=\"color:" + colorInput.value + "\"> _ </span>";
        }
    });

    // Handles font highlight input
    highlightInput.addEventListener("change", (e) => {
        let selection = document.getSelection();
        let text = selection.toString();

        //console.log(selection);

        if (text !== "") {
            let len = selection.getRangeAt(0).endOffset - selection.getRangeAt(0).startOffset;

            let t1 = document.createTextNode("\u0001");
            selection.getRangeAt(0).insertNode(t1);
            let start = base.innerHTML.indexOf("\u0001");
            t1.parentNode.removeChild(t1);

            let end = start + (len);
            base.innerHTML = base.innerHTML.substring(0, start) + "<span style=\"background-color:"+ highlightInput.value + "\">" + base.innerHTML.substring(start, end) + "</span>"  + base.innerHTML.substring(end, base.innerHTML.length);
        } else if (text === "" && document.getSelection().getRangeAt(0).startOffset != base.innerText.length) {
            let target = document.createTextNode("\u0001");
            document.getSelection().getRangeAt(0).insertNode(target);
            let start = base.innerHTML.indexOf("\u0001");
            target.parentNode.removeChild(target);

            base.innerHTML = base.innerHTML.substring(0, start) + "<span style=\"background-color:"+ highlightInput.value + "\">_</span>" + base.innerHTML.substring(start, base.innerHTML.length);
        } else {
            base.innerHTML += "<span style=\"background-color:" + highlightInput.value + "\">_</span>";
        }
    });

    // Highlighting and Modal Functions
    document.querySelector('#p1').onpointerup = ()=>{
        let selection = document.getSelection(), text = selection.toString();
        
        if (text !== "") {
            let rect = selection.getRangeAt(0).getBoundingClientRect();
            control.style.top = `calc(${rect.top}px - 30px)`;
            control.style.left = `calc(${rect.left}px)`;
            control['text']= text; 
            document.body.appendChild(control);
        }
    }

    // Handles block display
    function oncontroldown(event) {
        console.log("that");
        mod.style.display = "block";
        console.log(mod);
    }

    // Handles highlighted clicking
    document.onpointerdown = ()=>{  
        let control = document.querySelector('#control');
        if (control !== null) {
            control.remove();
        }
    }

    
    window.onclick = function(event) {
        if (event.target != control && event.target != mod && event.target != col2) {
            mod.style.display = "none";
        }
    }

    // Handles clicking the save button
    saveInp.addEventListener("click", (e) => {
        api.getCurrentUser().then(
            (user) => {
                if (user) {
                    let currDate = new Date().toJSON();
                    api.getNoteByName(titleInput.value, user.id).then(
                        (retrievedNote) => {
                            if (retrievedNote != null) {
                                api.updateNote(titleInput.value, subtitleInput.value, user.id, currDate, notes.innerHTML, retrievedNote.id);
                                alert("Saved!");
                            } else {
                                api.createNote(titleInput.value, subtitleInput.value, user.id, currDate, notes.innerHTML);
                                alert("Saved!");
                            }
                        } 
                    );                    
                }
            }
        );
    });

    // Handles clicking the save and exit button
    saveAndExitInp.addEventListener("click", (e) => {
        api.getCurrentUser().then(
            (user) => {
                if (user) {
                    let currDate = new Date().toJSON();
                    api.getNoteByName(titleInput.value, user.id).then(
                        (retrievedNote) => {
                            if (retrievedNote != null) {
                                api.updateNote(titleInput.value, subtitleInput.value, user.id, currDate, notes.innerHTML, retrievedNote.id);
                                alert("Saved!");
                                setTimeout(() => { console.log("Saved!"); }, 5000);
                                document.location = "/";
                            } else {
                                api.createNote(titleInput.value, subtitleInput.value, user.id, currDate, notes.innerHTML);
                                alert("Saved!");
                                setTimeout(() => { console.log("Saved!"); }, 5000);
                                document.location = "/";
                            }
                        } 
                    );                    
                }
            }
        );
    });

    // Handles clicking the exit button
    exitInp.addEventListener("click", (e) => {
        document.location = "/";
    });
});
