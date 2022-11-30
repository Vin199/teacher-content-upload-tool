let userData = JSON.parse(window.localStorage.getItem("userInfo"));
document.getElementById("emailField1").value = userData.email;

const setPasswordModal = document.getElementById("setPasswordModal");
setPasswordModal.style.display = "none";

const setPassword = document.getElementById("newPassword");
const setConfirmPassword = document.getElementById("confirmPassword");
const errMsg = document.getElementById("errMsg");
const tooltipText = document.getElementsByClassName("tooltiptext")[0];

document
  .getElementById("submitNewPassword")
  .addEventListener("click", async (e) => {
    errMsg.innerHTML = "";
    errMsg.style.display = "block";
    // get password

    const passwordVal = setPassword.value;
    const confirmPasswordVal = setConfirmPassword.value;

    //Password Validation
    //check empty password field
    if (passwordVal == "") {
      errMsg.innerHTML = "**Fill the password please!";
      setPassword.style.border = "2px solid red";
      setConfirmPassword.style.border = "2px solid red";
      return false;
    }

    //minimum password length validation
    if (passwordVal.length < 8) {
      errMsg.innerHTML = "**Password length must be atleast 8 characters";
      tooltipText.style.visibility = "visible";
      return false;
    }

    //maximum length of password validation
    else if (passwordVal.length > 15) {
      errMsg.innerHTML = "**Password length must not exceed 15 characters";
      tooltipText.style.visibility = "visible";
      return false;
    } else {
      //To check a password between 8 to 15 characters, which should contain at least one numeric digit and a special character,
      let passw = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/;
      if (passwordVal.match(passw)) {
        //Confirm Password
        if (passwordVal != confirmPasswordVal) {
          setPassword.style.border = "2px solid red";
          setConfirmPassword.style.border = "2px solid red";
          errMsg.innerHTML = "Passwords did not match";
        } else {
          setPasswordModal.style.display = "block";
          //alert("Password created successfully");
          const uid = userData.uid;

          try {
            const response = await fetch("/updatePassword", {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                uid,
                passwordVal,
              }),
            });

            const user = await response.json();
            // loginScreen(user);

            document.getElementById("proceed").addEventListener("click", () => {
              setPasswordModal.style.display = "none";
              location.href = "/emailLogin";
            });

            // show dialog message that password has set successfully
            // redirect to next screen for login
          } catch (error) {
            // show error
            alert(error);
            console.log(error);
          }
        }
      } else {
        errMsg.innerHTML = "Not Valid Password, Please enter a valid password!";
        tooltipText.style.visibility = "visible";
        return false;
      }
    }
  });

const togglePassword1 = document.querySelector("#togglePassword1");
const togglePassword2 = document.querySelector("#togglePassword2");

togglePassword1.addEventListener("click", function () {
  // toggle the type attribute
  const type =
    setPassword.getAttribute("type") === "password" ? "text" : "password";
  setPassword.setAttribute("type", type);

  // toggle the icon
  this.classList.toggle("bi-eye");
});

togglePassword2.addEventListener("click", function () {
  // toggle the type attribute
  const type =
    setConfirmPassword.getAttribute("type") === "password"
      ? "text"
      : "password";
  setConfirmPassword.setAttribute("type", type);

  // toggle the icon
  this.classList.toggle("bi-eye");
});

setPassword.addEventListener("keydown", (e) => {
  errMsg.style.display = "none";
  tooltipText.style = "none";
  setPassword.style.border = "2px solid #E2E8F0";
  setConfirmPassword.style.border = "2px solid #E2E8F0";
});

setConfirmPassword.addEventListener("keydown", (e) => {
  errMsg.style.display = "none";
  tooltipText.style = "none";
  setPassword.style.border = "2px solid #E2E8F0";
  setConfirmPassword.style.border = "2px solid #E2E8F0";
});
