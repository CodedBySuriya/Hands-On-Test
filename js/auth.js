const { constants } = require("fs/promises");

let container = document.getElementById("container");

function checklogin() {
  if (localStorage.getItem("loggedIn") == "true") {
    window.location.href = "/dashboard";
  }
}

window.addEventListener("load", checklogin);

toggle = () => {
  container.classList.toggle("sign-in");
  container.classList.toggle("sign-up");
};

setTimeout(() => {
  container.classList.add("sign-in");
}, 200);

async function loginAuth() {
  const password = document.getElementById("password-login").value;
  const username = document.getElementById("username-login").value;
  const signin = document.getElementById("signin");
  const signup = document.getElementById("signup");
  const requestBody = JSON.stringify({ password, username });

  signin.disabled = true;
  signup.disabled = true;

  signin.style.cursor = "not-allowed";
  signup.style.cursor = "not-allowed";

  fetch("https://hands-on-test.onrender.com/login-auth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: requestBody,
  })
    .then((response) => response.text())
    .then((data) => {
      if (data === "Login successful!") {
        alert("Login successful!");
        localStorage.setItem("username", username);
        localStorage.setItem("loggedIn", true);
        window.location.href = "/dashboard";
      } else {
        alert("Invalid username or password");
      }
    })
    .finally(() => {
      signin.disabled = false;
      signup.disabled = false;

      signin.style.cursor = "pointer";
      signup.style.cursor = "pointer";
    });
}

async function signAct() {
  const password = document.getElementById("password").value;
  const username = document.getElementById("username").value;
  const classOpt = document.getElementById("classOpt").value;
  const email = document.getElementById("email").value;
  const signup = document.getElementById("signup");
  const signin = document.getElementById("signin");

  signup.disabled = true;
  signin.disabled = true;

  signup.style.cursor = "not-allowed";
  signin.style.cursor = "not-allowed";

  if (
    password === "" ||
    username === "" ||
    classOpt === "" ||
    email === "" ||
    password === null ||
    username === null ||
    classOpt === null ||
    email === null ||
    classOpt === "Select Class"
  ) {
    alert("fill all the fields");
  } else {
    const requestBody = JSON.stringify({ password, username, classOpt, email }); // ✅ Ensure it's JSON
    fetch("https://hands-on-test.onrender.com/sign-act", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // ✅ Ensure it's JSON
      },
      body: requestBody,
    })
      .then(
        (response) => {
          if (response.ok) {
            alert("User added✅");
            toggle();
          } else {
            alert("User not added❌");
          }
        },
        (error) => {
          console.error("Error:", error);
        }
      )
      .finally(() => {
        signup.disabled = false;
        signin.disabled = false;

        signup.style.cursor = "pointer";
        signin.style.cursor = "pointer";
      });
  }
}
