const express = require('express');
const apiNoteController = express.Router();

apiNoteController.use(express.json());

// For creating file data
const fileSys = require('fs');

// For handling paths
const path = require('path');

// Get all notes
// Will maybe want to update for the file system to add a catch in case of an error. I'm not completely sure
// how you will use this function though.
apiNoteController.get('/notes', (req, res) => {
    NotesDAO.getNotesByOwner(req.body.owner).then(
        (noteList) => {
            res.json(noteList);
        }
    );
});

const NotesDAO = require("../db/NoteDAO");
const FolderDAO = require('../db/FolderDAO');

// Get notes
apiNoteController.get('/notes/:ownerId/:noteId', (req, res) => {
    const noteid = req.params.noteId;
    const ownerid = req.params.ownerId;
    NotesDAO.getNotesByOwner(ownerid).then(
        (list) => {
            let index = -1;
            for (let i = 0; i < list.length; i++) {
                if (list[i].name == noteid) {
                    index = i;
                }
            }
            if (index != -1) {
                NotesDAO.getNoteById(list[index].id).then(
                    (retNote) => {
                        if (retNote != null) {
                            res.json(retNote);
                        } else {
                            res.status(404).json({error: 'Note not found.'});
                        }
                    }
                );
            } else {
                res.json(null);
            }
        });
});

apiNoteController.get('/notes/:noteId', (req, res) => {
    const noteid = req.params.noteId;
    NotesDAO.getNoteById(noteid).then(
        (retNote) => {
            if (retNote != null) {
                
                let dat = fileSys.readFileSync(retNote.file_path, 'utf8');
                console.log(dat);
                let noteInfo = {
                    id: retNote.id,
                    name: retNote.name,
                    sub_name: retNote.sub_name,
                    owner: retNote.owner,
                    timestamp: retNote.timestamp,
                    dataString: dat
                }

                res.json(noteInfo);
                
            } else {
                res.status(404).json({error: 'Note not found.'});
            }
        }
    );
});

// Post note
apiNoteController.post('/notes', (req, res) => {
    NotesDAO.getNoteByNameAndOwner(req.body.name, req.body.owner).then(note => {
        const dataPath = path.join(__dirname, '../data/notes/');
        let fileName = dataPath + req.body.owner + req.body.name + ".txt";
        if (req.body.dataString) {
            fileSys.writeFile(fileName, req.body.dataString, (err) => {
                if (err) {
                    res.status(400).json({error: 'Problem writing file data.'});
                }
            });
        } else {
            let data = "";
            fileSys.writeFile(fileName, data, (err) => {
                if (err) {
                    res.status(400).json({error: 'Problem writing file data.'});
                }
            });
        }

         
        if (req.body.folder && req.body.name && req.body.owner && req.body.last_save && fileName) {            
            let restructuredDate = new Date(req.body.last_save).toISOString().slice(0, 19).replace('T', ' ');
            let newNote = {
                name: req.body.name,
                sub_name: req.body.sub_name,
                owner: req.body.owner,
                last_save: restructuredDate,
                file_path: fileName
            }
    
            NotesDAO.insertNote(newNote);
            NotesDAO.getNoteByNameAndOwner(req.body.name, req.body.owner).then(e => {
                FolderDAO.addNoteToFolder(e.id, req.body.folder);
                
                res.json({
                    success: true,
                    id: e.id
                });
            });
        } else {
            res.status(400).json({error: 'Note parameters missing'});
        }
    }).catch(() => {
        res.status(400).json({error: 'A note with that name already exists.'});
    });
});

// Put note
apiNoteController.put('/notes', (req, res) => {
    if (req.body.id && req.body.name) {

        const dataPath = path.join(__dirname, '../data/notes/');
        let fileName = dataPath + req.body.owner + req.body.name + ".txt";
        if (req.body.dataString) {
            fileSys.writeFile(fileName, req.body.dataString, (err) => {
                if (err) {
                    res.status(400).json({error: 'Problem writing file data.'});
                }
            });
        } else {
            let data = "";
            fileSys.writeFile(fileName, data, (err) => {
                if (err) {
                    res.status(400).json({error: 'Problem writing file data.'});
                }
            });
        }

        let restructuredDate = new Date(req.body.last_save).toISOString().slice(0, 19).replace('T', ' ');
        let note = {
            name: req.body.name,
            sub_name: req.body.sub_name,
            owner: req.body.owner,
            last_save: restructuredDate,
            file_path: fileName,
            id: req.body.id,
        }

        NotesDAO.updateNote(note);

        res.json({success: true});
    } else {
        res.status(400).json({error: 'Note parameters missing'});
    }
});

// Delete note
apiNoteController.delete('/notes/:noteId', (req, res) => {
    const noteid = req.params.noteId;

    NotesDAO.deleteNote(noteid).then(e => {
        res.json({success: true});
    });
});

module.exports = apiNoteController;
