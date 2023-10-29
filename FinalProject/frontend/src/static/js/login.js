import api from './APIClient.js';

const loginUser = document.querySelector("#login-user");
const loginPass = document.querySelector("#login-pass");
const loginWarn = document.querySelector("#login-warn");
const loginBtn = document.querySelector("#login-btn");

const signupUser = document.querySelector("#signup-user");
const signupPass = document.querySelector("#signup-pass");
const signupRePass = document.querySelector("#signup-repass");
const signupConfirm = document.querySelector("#signup-confirm");
const signupWarn = document.querySelector("#signup-warn");
const signupBtn = document.querySelector("#signup-btn");

loginBtn.addEventListener('click', () => { 
  api.login(loginUser.value, loginPass.value).then(() => {
    document.location = "/";
  }).catch((err) => {
    loginWarn.textContent = err.message;
  });
});

signupBtn.addEventListener('click', () => {
  api.signup(signupUser.value, signupPass.value, signupRePass.value).then(() => {
    // reset signup
    signupUser.value = "";
    signupPass.value = "";
    signupRePass.value = "";

    signupWarn.textContent = "";
    signupConfirm.textContent = "Account created";
  }).catch((err) => {
    signupWarn.textContent = err.message;
    signupConfirm.textContent = "";
  });
});
