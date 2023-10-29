const crypto = require('crypto');

module.exports = class {
  #passwordHash;
  #salt;

  constructor(data) {
    this.id = data.user_id;
    this.username = data.username;
    this.#salt = data.salt;
    this.#passwordHash = data.password;
  }

  validatePassword(password) {
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(password, this.#salt, 1000, 64, 'sha256', (err, derivedKey) => {
        if (err) { //problem computing digest, like hash function not available
         reject("Error: " +err);
        }

        const digest = derivedKey.toString('hex');
        if (this.#passwordHash == digest) {
          resolve(this);
        }
        else {
          reject("Invalid username or password");
        }
      });
    });
  }

  toJSON() {
    return {
      id: this.id,
      first_name: this.first_name,
      last_name: this.last_name,
      username: this.username,
    }
  }
};
