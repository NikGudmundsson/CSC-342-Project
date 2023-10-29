import HTTPClient from "./HTTPClient.js";

export default {
  // login page
  login: (user, pass) => {
    let data = {
      username: user,
      password: pass
    }
    return HTTPClient.post('/accounts/login', data);
  },

  signup: (user, pass, repass) => {
    let data = {
      username: user,
      password: pass,
      repassword: repass
    }
    return HTTPClient.post('/accounts/signup', data);
  },

  // common js
  getCurrentUser: () => {
    return HTTPClient.get('/accounts/current');
  },

  // fs page
  logout: () => {
    return HTTPClient.post('/accounts/logout', {});
  },

  getNotesByFolder: (name) => {
    return HTTPClient.get('/folders/' + name);
  },

  shareNote: (note, newUser, owner) => {
    let data = {
      id: note,
      user: newUser,
      owner: owner
    }
    return HTTPClient.post('/share', data)
  },

  deleteNote: (note) => {
    return HTTPClient.delete('/notes/' + note);
  },
  
  // notes page

  // Get a note by the note's name. Note: We're actually going to want to modify this to also check by current user so that
  // multiple users can have the same note name.
  getNoteByName:(name, user_id) => {
    return HTTPClient.get('/notes/' + user_id + '/' + name, {});
  },

  getNoteById:(note_id) => {
    return HTTPClient.get('/notes/' + note_id);
  },

  createNote:(folder, title, subtitle, owner, timestamp, dataString) => {
    let data = {
      folder: folder,
      name: title,
      sub_name: subtitle,
      owner: owner,
      last_save: timestamp,
      dataString: dataString
    }
    return HTTPClient.post('/notes/', data);
  },

  updateNote:(title, subtitle, owner, timestamp, dataString, id) => {
    let data = {
      name: title,
      sub_name: subtitle,
      owner: owner,
      last_save: timestamp,
      dataString: dataString,
      id: id
    }
    return HTTPClient.put('/notes/', data);
  }
};
