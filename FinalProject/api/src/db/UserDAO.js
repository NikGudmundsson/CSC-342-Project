const db = require('./DBConnection');
const User = require('./models/User');

function getUserByCredentials(username, password) {
  return db.query('SELECT * FROM user WHERE username=?', [username]).then(({results}) => {
    if (!results.length) {
      return new Promise((resolve, reject) => {reject("No such user")});
    }

    const user = new User(results[0]);
    if (user) { // we found our user
      return user.validatePassword(password);
    }
    else { // if no user with provided username
      throw new Error("No such user");
    }
  });
}

function existingUser(username) {
  return db.query('SELECT * FROM user where username=?', [username]).then(({results}) => {
    if (!results.length) {
      throw new Error("No such user");
    } else {
      const user = new User(results[0]);
      return user.id;
    }
  });
}

function insertUser(username, password, salt) {
  return db.query('INSERT INTO user (username, password, salt) VALUES (?, ?, ?)', [username, password, salt]).then(({results}) => {
      return results;
  });
}

module.exports = {
    getUserByCredentials: getUserByCredentials,
    existingUser: existingUser,
    insertUser: insertUser,
};
