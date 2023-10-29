const db = require('./DBConnection');
const Folder = require('./models/Folder');

function insertFolder(folder) {
    return db.query('INSERT INTO folders (folder_name, owner) VALUES (?, ?)', [folder.name, folder.owner]).then(({results}) => {
        return results;
    });
}

function getFoldersByOwner(owner) {
    return db.query('SELECT * FROM folders WHERE owner = ?', [owner]).then(({results}) => {
        let folders = []
        for (let i = 0; i < results.length; i ++) {
            let folder = new Folder(results[i]);
            folders.push(folder);
        }
        return folders;
    });
}

function updateFolder(folder) {
    return db.query('UPDATE folder SET folder_name = ?, owner = ?', [folder.name, folder.owner]).then(({results}) => {
        return results;
    });
}

function deleteFolder(folder) {
    return db.query('DELETE FROM folder WHERE folder_name = ?', [folder]).then(({results}) => {
        return results;
    });
}

function addNoteToFolder(note, folder) {
    return db.query('INSERT INTO folder_note_lookup (folder_id, note_id) VALUES (?, ?)', [folder, note]).then(({results}) => {
        return results;
    });
}

module.exports = {
    insertFolder: insertFolder,
    getFoldersByOwner: getFoldersByOwner,
    updateFolder: updateFolder,
    deleteFolder: deleteFolder,
    addNoteToFolder: addNoteToFolder,
};
