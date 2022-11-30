// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-auth.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyC5UiikQU2_-_omC-qKYcXA0X4Ta8whfuI",
  authDomain: "iprep-7f10a.firebaseapp.com",
  databaseURL: "https://iprep-dev.firebaseio.com/",
  projectId: "iprep-7f10a",
  storageBucket: "iprep-7f10a.appspot.com",
  messagingSenderId: "165257927521",
  appId: "1:165257927521:web:3d145f0c2b04eafd",
  measurementId: "G-SXFQPY83P3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

let userData = JSON.parse(window.localStorage.getItem("userInfo"));
document.getElementById("emailField1").value = userData.email;

const getPassword = document.getElementById("emailPassword1");
const getEmail = document.getElementById("emailField1");
const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", function () {
  // toggle the type attribute
  const type =
  getPassword.getAttribute("type") === "password" ? "text" : "password";
  getPassword.setAttribute("type", type);

  // toggle the icon
  this.classList.toggle("bi-eye");
});

document.getElementById("login").addEventListener("click", () => {
  const email = getEmail.value;
  const password = getPassword.value;

  signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      // Signed in
      const user = userCredential.user;
      const res = await fetch("/setSession?uid=" + user.uid, {
        method: "GET",
      });
      const parsedResponse = await res.json();

      location.href = "/dashboard";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      getPassword.style.borderColor = "red";
      document.getElementById("wrongPsswrd").innerHTML =
        "You have entered an invalid password";
      //alert("You have entered an invalid username or password");
      console.log("error:: ", errorMessage);
    });
});

document.getElementById("back_button").onclick = () => {
  location.href = "/";
};

getPassword.addEventListener("keyup", (e) => {
  if (e.target.value == "") {
    document.getElementById("wrongPsswrd").style.fontSize = "0px";
    getPassword.style.border = "2px solid #E2E8F0";
  }
});
