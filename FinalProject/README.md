# Notes for Tech Students
## Group T: Final Project
- Bailey Sumner(bsumner2)
- Nik Gudmundsson (nkgudmun)
- Sean Yi (sjyi)

## Features
- Notes: Users can create and write in the notes page. The notes page looks a little different than many conventional note designs so that it has a little more pop and individuality to it. Users can highlight and recolor words for their notes. We tried to think through and recreate a functional note design via concatenation and modification of html elements via javascript. Because we took a tag approach, we can do much of the highlighting and coloring without a hitch, but there can be issues when tags overlap. Because the HTML tags can't be half-inside each other, this will prevent certain style changes to be made. With more time, we probably would have tried a rendering approach with the canvas tag. The notes are mostly functional however. Notes can be saved, reaccessed, and edited at the user's leisure.

## User Authentication Process
NFTS uses the same authentication/authorization process as HW05. Every API endpoint other than login, logout and signup uses the `authMiddleware` to verify the JWT. Additionally, the home and notes page runs the `common.js` which checks if the user is authenticated. All data is being stored on the database, which can only be access after the user is authenticated.

## List of Pages
### Login
The login page is the start point for the application, upon opening the application it appears to the users. The login and sign up handling is organized a couple pop-ups. When the authentication token expires, the user is sent back to this page.

### Home
The home page is accessible after logging into the system and acts as the main hub for the rest of the application. It can also be accessed from the notes page after selecting either the "exit" or "save and exit" options. This page appears offline and should contain the files that the user previously had loaded the last time they were online.

### Notes
The notes page is accessible either by opening an already existing note or by creating a new note. It also works offline, allowing users to edit their notes.

## API Endpoints
Method | Route                 | Description
------ | --------------------- | ---------
`GET`   | `/accounts/current`              | Retrieves current user based on JWT 
`POST`   | `/accounts/login`               | Checks user credentials and gives JWT
`POST`   | `/accounts/signup`              | Creates new user
`POST`   | `/accounts/logout`              | Expires JWT and logs user out
`GET`    | `/folders`                | Retrieves a list of all folders
`POST`   | `/folders`                | Creates a new folder
`GET`    | `/notes`                  | Retrieves a list of all notes
`GET`    | `/notes/noteID`           | Retrieves a note based on its ID (name) and formats it
`GET`    | `/notes/ownerID/noteID`   | Retrieves a note based on its ID (name) and checks against the owner ID to make sure it is valid
`POST`   | `/notes`                  | Creates a new note
`PUT`    | `/notes`                  | Updates a note
`DELETE` | `/notes/noteID`           | Deletes a note based on its ID (name)


## ER Diagram 
![image](https://media.github.ncsu.edu/user/11406/files/8df17213-0e75-4da1-ad5e-74112166920d)

## Contributions  
Sean Yi 
- 

Nik Gudmundsson 
- Completed the notes frontend implementation
- Wrote much of the note related API endpoints and backend
- Modified the database and its relationship with the backend to allow for proper transfer of data

Bailey Sumner
- Wrote the webmanifest and made the app downloadable
- Added the service worker and online functionality
- Modified the database to include a table for connecting multiple people to a shared note
