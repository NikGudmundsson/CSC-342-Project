const express = require('express');
const frontendRouter = express.Router();

const path = require('path');
// Designate the static folder as serving static resources
frontendRouter.use(express.static('static'));
frontendRouter.use(express.urlencoded({extended: true}));
const html_dir = path.join(__dirname, '../templates/');

frontendRouter.get('/login', (req, res) => {
    res.sendFile(`${html_dir}login.html`);
});

frontendRouter.get('/', (req, res) => {
    res.sendFile(`${html_dir}home.html`);
});

frontendRouter.get('/notes', (req, res) => {
    res.sendFile(`${html_dir}notes.html`);
});

frontendRouter.get('/settings', (req, res) => {
    //File to be added in the future.
});

frontendRouter.get('/plugins', (req, res) => {
    //File to be added in the future.
});

frontendRouter.get('/marketplace', (req, res) => {
    //File to be added in the future. This could maybe be done via a modal. The CSS may be a little wild though.
});

module.exports = frontendRouter;
