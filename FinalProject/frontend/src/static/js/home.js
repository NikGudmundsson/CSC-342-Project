import api from './APIClient.js';

const homeFolder = document.querySelector("#side-home");
const sharedFolder = document.querySelector("#side-shared");
const logout = document.querySelector("#side-logout");

const menu = document.querySelector('#alt-menu');

const menuID = document.querySelector('#userID');

const fsName = document.querySelector('#fs-name');
const fsDir = document.querySelector('#fs-dir');

const addBtn = document.querySelector('#add-btn');
const addFilename = document.querySelector('#add-filename');
const addWarn = document.querySelector('#add-warn');

const shareBtn = document.querySelector('#share-btn');
const shareUser = document.querySelector('#share-user');

const deleteBtn = document.querySelector('#delete-btn');

let userID;
let homeID;
let sharedID;

let targetFile;

function createFileIcon(notesID, filename) {
  const file = document.createElement('a');
  file.classList.add('m-1');
  file.classList.add('px-2');
  file.classList.add('txt-color');
  file.classList.add('file-btn');
  file.href = "/notes?id=" + notesID;
  file.value = notesID;

  const icon = document.createElement('i');
  icon.classList.add('bi');
  icon.classList.add('bi-file-earmark');
  icon.classList.add('fs-icon');
  file.appendChild(icon);

  const p = document.createElement('p');
  p.textContent = filename;
  file.appendChild(p);

  return file;
}

api.getCurrentUser().then(e => {
  userID = e.id;
  homeID = e.homeID;
  sharedID = e.sharedID;

  // initial loading
  menuID.textContent = e.username;
  fsName.textContent = 'Home';

  while (fsDir.firstChild) {
    fsDir.removeChild(fsDir.lastChild);
  }

  api.getNotesByFolder(homeID).then(e => {
    e.forEach(i => {
      let file = createFileIcon(i.id, i.name);
      fsDir.append(file);
      
      // https://itnext.io/how-to-create-a-custom-right-click-menu-with-javascript-9c368bb58724
      file.addEventListener('contextmenu', e => {
        e.preventDefault();
    
        const { clientX: mouseX, clientY: mouseY } = e;
    
        menu.style.top = `${mouseY}px`;
        menu.style.left = `${mouseX}px`;
    
        menu.style.display = 'block';
        
        if (e.target.tagName != "A") {
          targetFile = e.target.parentElement;
        } else {
          targetFile = e.target;
        }
      });
    });
  });
});

homeFolder.addEventListener('click', () => { 
  fsName.textContent = 'Home';

  while (fsDir.firstChild) {
    fsDir.removeChild(fsDir.lastChild);
  }

  api.getNotesByFolder(homeID).then(e => {
    e.forEach(i => {
      let file = createFileIcon(i.id, i.name);
      fsDir.append(file);
      
      // https://itnext.io/how-to-create-a-custom-right-click-menu-with-javascript-9c368bb58724
      file.addEventListener('contextmenu', e => {
        e.preventDefault();
    
        const { clientX: mouseX, clientY: mouseY } = e;
    
        menu.style.top = `${mouseY}px`;
        menu.style.left = `${mouseX}px`;
    
        menu.style.display = 'block';
        
        if (e.target.tagName != "A") {
          targetFile = e.target.parentElement;
        } else {
          targetFile = e.target;
        }
      });
    });
  });
});

sharedFolder.addEventListener('click', () => { 
  fsName.textContent = 'Shared';

  while (fsDir.firstChild) {
    fsDir.removeChild(fsDir.lastChild);
  }

  api.getNotesByFolder(sharedID).then(e => {
    e.forEach(i => {
      let file = createFileIcon(i.id, i.name);
      fsDir.append(file);
    });
  });
});

logout.addEventListener('click', () => { 
  api.logout().then(e => {
    if (e.success) {
      console.log("Successful logout");
      document.location = '/login';
    } else {
      throw new Error();
    }
  }).catch((err) => {
    console.log("Problem with logout");
  });
});

window.addEventListener('click', e => {
  if (e.target.offsetParent != menu) {
    menu.style.display = 'none';
  }
});

addBtn.addEventListener('click', () => {
  if (addFilename.value != "") { 
    api.createNote(homeID, addFilename.value, "", userID, new Date().toJSON(), "").then(e => {
      document.location = "/notes?id=" + e.id;
    });
  } else {
    addWarn.textContent = "Empty filename";
  }
});

shareBtn.addEventListener('click', () => {
  api.shareNote(targetFile.value, shareUser.value, userID);
});

deleteBtn.addEventListener('click', e => {
  api.deleteNote(targetFile.value);
  targetFile.remove();
});
