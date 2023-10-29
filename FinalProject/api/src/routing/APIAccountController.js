const express = require('express');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');

const apiAccountController = express.Router();

apiAccountController.use(cookieParser());
apiAccountController.use(express.json());

const UserDAO = require('../db/UserDAO');
const FolderDAO = require('../db/FolderDAO');

const {authMiddleware, generateToken, removeToken} = require('../middleware/authMiddleware');

// login
apiAccountController.post('/accounts/login', (req, res) => {
	if(req.body.username && req.body.password) {
    UserDAO.getUserByCredentials(req.body.username, req.body.password).then(user => {
			let data = {
				user: user
			}
			generateToken(req, res, user);
			res.json(data);
		}).catch(err => {
			res.status(400).json({error: err});
		});
  }
  else {
    res.status(400).json({error: 'Missing fields'});
  }
});

// signup
// https://stackoverflow.com/questions/8855687/secure-random-token-in-node-js
apiAccountController.post('/accounts/signup', (req, res) => {
	if(req.body.username && req.body.password && req.body.repassword) {
		if (req.body.password != req.body.repassword) {
			res.status(400).json({error: 'Password mismatch'});
		}
		else {
			crypto.randomBytes(5, function(err, buf) {
				let salt = buf.toString('hex');
	
				crypto.pbkdf2(req.body.password, salt, 1000, 64, 'sha256', (err, key) => {
					UserDAO.insertUser(req.body.username, key.toString('hex'), salt).then(e => {
						// create home folder and shared folder
						UserDAO.getUserByCredentials(req.body.username, req.body.password).then(j => {
							let home = {
								name: "home",
								owner: j.id
							};
							FolderDAO.insertFolder(home);

							let shared = {
								name: "shared",
								owner: j.id
							};
							FolderDAO.insertFolder(shared);
						});

						res.json({success: true});
					}).catch(err => {
						res.status(400).json({error: 'Username duplicate'});
					});
				});
			});
		}
  }
  else {
    res.status(400).json({error: 'Missing fields'});
  }
});

function findIDByName(folder, arr) {
	for (let i = 0; i < arr.length; i++) {
		if (arr[i].name == folder) {
			return arr[i].id;
		}
	}
}

// common js, check user
apiAccountController.get('/accounts/current', authMiddleware, (req,  res) => {
	let homeid;
	let sharedid;

	FolderDAO.getFoldersByOwner(req.user.id).then(e => {
		homeid = findIDByName('home', e);
		sharedid = findIDByName('shared', e);

		res.json({
			id: req.user.id,
			username: req.user.username,
			homeID: homeid,
			sharedID: sharedid 
		});
	});
});

// logout
apiAccountController.post('/accounts/logout', (req, res) => {
  removeToken(req, res);
  res.json({success: true});
});

module.exports = apiAccountController;
