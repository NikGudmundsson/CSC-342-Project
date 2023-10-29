const db = require('./DBConnection');
const Note = require('./models/Note');

function insertNote(note) {
    return db.query('INSERT INTO notes (name, sub_name, owner, last_save, file_path) VALUES (?, ?, ?, ?, ?)', [note.name, note.sub_name, note.owner, note.last_save, note.file_path]).then(({results}) => {
        return results;
    });
}

function updateNote(note) {
    return db.query('UPDATE notes SET name = ?, sub_name = ?, owner = ?, last_save = ?, file_path = ? WHERE note_id = ?', [note.name, note.sub_name, note.owner, note.last_save, note.file_path, note.id]).then(({results}) => {
        return results;
    });
}

function deleteNote(note) {
    return db.query('DELETE FROM folder_note_lookup WHERE note_id = ?', [note])
    .then(db.query('DELETE FROM notes WHERE note_id = ?', [note]).then(({results}) => {
        return results;
    }));
}

function getNotesByOwner(owner) {
    return db.query('SELECT * FROM notes WHERE owner = ?', [owner]).then(({results}) => {
        let notes = []
        for (let i = 0; i < results.length; i ++) {
            let note = new Note(results[i]);
            notes.push(note);
        }
        return notes;
    });
}

function getNotesByFolderID(folder) {
    return db.query('SELECT * FROM folder_note_lookup WHERE folder_id = ?', [folder]).then(({results}) => {
        let notes = []
        for (let i = 0; i < results.length; i++) {
            notes.push(getNoteById(results[i].note_id).then(e => {
                return e;
            }));
        }
        return Promise.all(notes);
    });
}

function getNoteById(id) {
    return db.query('SELECT * FROM notes WHERE note_id = ?', [id]).then(({results}) => {
        if (results[0]) {
            return new Note(results[0]);
        } else {
            return null;
        }
    });
}

function getNoteByNameAndOwner(name) {
    return db.query('SELECT * FROM notes WHERE name = ?', [name]).then(({results}) => {
        if (results[0]) {
            return new Note(results[0]);
        } else {
            return null;
        }
    });
}

function addImage(file_path, note_id) {
    return db.query('INSERT INTO images (img_path, note) VALUES (?, ?)', [file_path, note_id]).then(({results}) => {
        return results;
    });
}

function removeImage(file_path) {
    return db.query('DELETE FROM images WHERE img_path = ?', [file_path]).then(({results}) => {
        return results;
    });
}

module.exports = {
    insertNote: insertNote,
    updateNote: updateNote,
    deleteNote: deleteNote,
    getNotesByOwner: getNotesByOwner,
    getNotesByFolderID: getNotesByFolderID,
    getNoteById: getNoteById,
    getNoteByNameAndOwner: getNoteByNameAndOwner,
    addImage: addImage,
    removeImage: removeImage,
};
