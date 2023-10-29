const express = require('express');
const apiFolderController = express.Router();

apiFolderController.use(express.json());

// Set up
let folders = require("../data_deprecated/folders.json");

const NotesDAO = require("../db/NoteDAO");
const UserDAO = require("../db/UserDAO");
const FolderDAO = require("../db/FolderDAO");

// Get all folders 
// apiFolderController.get('/folders', (req, res) => {
//   res.json(folders);
// });

// Get a single folder by ID
apiFolderController.get('/folders/:folderID', (req, res) => {
  const folderid = req.params.folderID;
  
  NotesDAO.getNotesByFolderID(folderid).then(e => {
    res.json(e);
  });
});

// share note with user
apiFolderController.post('/share', (req, res) => {
  // check if user exists then add user
  if (req.body.id && req.body.user && req.body.owner) {
    UserDAO.existingUser(req.body.user)
    .then(userID => {
      if (userID == req.body.owner) {
        res.status(400).json({error: "You own this file"});
      } else {
        FolderDAO.getFoldersByOwner(userID).then(arr => {
          for (let i = 0; i < arr.length; i++) {
            if (arr[i].name == 'shared') {
              return arr[i].id;
            }
          }
        }).then(folderID => {
          FolderDAO.addNoteToFolder(req.body.id, folderID);
          res.json({success: true});
        });
      }
    })
    .catch(err => {
      res.status(400).json({error: "User doesn't exist"});
    });
  } else {
    res.status(400).json({error: "Missing parameter"});
  }
});

// // Put a folder
// apiFolderController.put('/folders/:folderID', (req, res) => {
//     // Placeholder informations
//   let folder = {
//     name: "Folder 3",
//     contents: ["Example1"]
//   };
//   res.json(folder);
// });

// // Post a folder
// apiFolderController.post('/folders', (req, res) => {
//   // Placeholder information
//   let newFolder = {
//     name: "Folder 4",
//     contents: ["Example2"]
//   };
//   res.json(newFolder);
// });

// // Delete a folder
// apiFolderController.delete('/folders/:folderID', (req, res) => {
//   res.status(501).json({error: "Not implemented."});
// });

// // Deletes all folders
// apiFolderController.delete('/folders', (req, res) => {
//   res.status(501).json({error: "Not implemented."});
// });

module.exports = apiFolderController;
