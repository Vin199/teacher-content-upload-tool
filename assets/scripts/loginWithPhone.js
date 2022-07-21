import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-auth.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDNFbXQo3Fd7PYfWBwGJd6XdihZ3w-yEvk",
  authDomain: "node-project-c4942.firebaseapp.com",
  databaseURL: "https://node-project-c4942-default-rtdb.firebaseio.com",
  projectId: "node-project-c4942",
  storageBucket: "node-project-c4942.appspot.com",
  messagingSenderId: "581470710657",
  appId: "1:581470710657:web:a4792037ef1d415c375680",
  measurementId: "G-HQZDXNGMJ3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const otpScreen = document.getElementById("otpScreen");
const codeField = document.getElementById("otp");
const resendBtn = document.getElementById("resend");
const resendTimer = document.getElementById("resendText");
const incorrectOtpMsg = document.getElementById("wrongOtpMsg");
const signInWithPhoneButton = document.getElementById("continue");
resendBtn.style.display = "none";

const userPhoneNum = JSON.parse(window.localStorage.getItem("userPhoneInfo"));
document.getElementById(
  "phoneNum"
).innerHTML = `Verification OTP sent to ${userPhoneNum.phoneNum}`;

$(document).ready(function () {
  if (JSON.parse(sessionStorage.getItem("isRedirected"))) {
    sendVerificationCode();
    sessionStorage.setItem("isRedirected", false);
  } else {
    location.href = "/";
  }
});

let appVerifier = new RecaptchaVerifier(
  "recaptcha",
  { size: "invisible" },
  auth
);

const sendVerificationCode = () => {
  // Sends the 6 digit code to the user's phone
  signInWithPhoneNumber(auth, `+91${userPhoneNum.phoneNum}`, appVerifier)
    .then((confirmationResult) => {
      let getconfirmationResult = confirmationResult;

      let time = 30;
      let otpInterval = setInterval(() => {
        const t = --time;

        if (t == 0) {
          clearInterval(otpInterval);
          resendTimer.style.display = "none";
          resendBtn.style.display = "block";
        }
        resendTimer.innerHTML =
          "Resend OTP in 00:" + (t < 10 ? "0" + t : t) + " Seconds";
      }, 1000);

      // Sign in if the verification code is set correctly
      signInWithPhoneButton.addEventListener("click", () =>
        signInWithPhone(getconfirmationResult)
      );
    })
    .catch((error) => {
      // Error; SMS not sent
      // ...
      window.alert("SMS Not Sent");
      console.log(error);
    });
};

const signInWithPhone = (getconfirmationResult) => {
  const code = codeField.value;
  getconfirmationResult
    .confirm(code)
    .then(async (result) => {
      // User signed in successfully.
      const user = result.user;
      const res = await fetch("/setSession?uid=" + user.uid, {
        method: "GET",
      });
      const parsedResponse = await res.json();

      location.href = "/dashboard";
    })
    .catch((error) => {
      // User couldn't sign in (bad verification code?)
      //resendTimer.style.display = "none";
      codeField.style.borderColor = "red";
      //resendBtn.style.display = "block";
      resendBtn.addEventListener("click", () => {
        codeField.style.borderColor = null;
        resendBtn.style.display = "none";
        resendTimer.style.display = "block";
        incorrectOtpMsg.style.display = "none";
        incorrectOtpMsg.style.display = "block";
        incorrectOtpMsg.innerHTML = "";
        sendVerificationCode();
      });
      incorrectOtpMsg.innerHTML = "The OTP you have entered is incorrect.";
      codeField.value = "";
      console.log(error);
    });
};

resendBtn.addEventListener("click", () => {
  resendTimer.style.display = "block";
  resendBtn.style.display = "none";
  sendVerificationCode();
});

document.getElementById("back_button").onclick = () => {
  history.back();
};

// const Hii = () => {
//   alert("Hellooo");
// };

// window.Hii = Hii;
