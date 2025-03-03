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

  const requestBody = JSON.stringify({ password, username });

  fetch("https://handson-4oly.onrender.com/login-auth", {
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
    });
}

async function signAct() {
  const password = document.getElementById("password").value;
  const username = document.getElementById("username").value;
  const classOpt = document.getElementById("classOpt").value;
  const email = document.getElementById("email").value;

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
    fetch("https://handson-4oly.onrender.com/sign-act", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // ✅ Ensure it's JSON
      },
      body: requestBody,
    }).then(
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
    );
  }
}
