function checklogin() {
  if (localStorage.getItem("loggedIn") !== "true") {
    window.location.href = "/auth";
  }
}

window.addEventListener("load", checklogin);

function logout() {
  localStorage.removeItem("loggedIn");
  localStorage.removeItem("username");
  location.replace("https://handson-4oly.onrender.com/auth");
}

document.addEventListener("DOMContentLoaded", function () {
  const username = localStorage.getItem("username") || "Guest";
  console.log(username);
  const titleElement = document.getElementById("title-welcome");

  if (titleElement) {
    titleElement.textContent = `Hi ${username}`;
  } else {
    console.error("Element with ID 'title-welcome' not found.");
  }
});

document.addEventListener("input", function (event) {
  if (event.target.tagName.toLowerCase() === "textarea") {
    event.target.style.height = event.target.scrollHeight + "px";
  }
});

function getAItxt() {
  if (document.getElementById("inputPatientName").value === "") return;
  const btnSub = document.getElementById("submit");
  btnSub.disabled = true;
  btnSub.style.cursor = "not-allowed";

  // Show loading dot
  document.getElementById("loading-dot").classList.remove("hidden");

  const prompt = document.getElementById("inputPatientName").value;
  console.log(prompt);

  fetch("https://handson-4oly.onrender.com/get-ai-txt", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userPrompt: prompt }),
  })
    .then((response) => response.text())
    .then((data) => {
      console.log(data);
      const outputArea = document.getElementById("output-area");

      const resTXT = document.createElement("p");
      resTXT.innerHTML = data;

      const divider = document.createElement("hr");
      divider.classList.add("divider");
      divider.style.width = "100%";
      divider.style.height = "1px";
      divider.style.backgroundColor = "#ccc";
      divider.style.margin = "20px 0";

      outputArea.appendChild(resTXT);
      outputArea.appendChild(divider);

      scrollToBottom();
    })
    .finally(() => {
      // Hide loading dot after response
      document.getElementById("loading-dot").classList.add("hidden");
    });
}

function scrollToBottom() {
  obvOutput.scrollTo({ top: obvOutput.scrollHeight, behavior: "smooth" });
}

const obvOutput = document.getElementById("output-area");

const observer = new MutationObserver((mutationsList) => {
  mutationsList.forEach((mutation) => {
    if (mutation.type === "childList") {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeName === "P") {
          const btnSub = document.getElementById("submit");
          btnSub.disabled = false;
          btnSub.style.cursor = "pointer";
          scrollToBottom(); // Smoothly scroll down when a new paragraph is added
        }
      });
    }
  });
});

observer.observe(obvOutput, { childList: true });
