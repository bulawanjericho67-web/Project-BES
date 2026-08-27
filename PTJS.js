const STORAGE_KEY = "userData";
const VERIFICATION_KEY = "verificationRequest";
const SESSION_KEY = "currentUser";
const API_URL = window.location.port === "3000" ? "/api" : "http://localhost:3000/api";

let userName = [];
let pass = [];
let email = [];

function loadUsers() {
  try {
    const storedUsers = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (
      storedUsers &&
      Array.isArray(storedUsers.userName) &&
      Array.isArray(storedUsers.pass) &&
      Array.isArray(storedUsers.email)
    ) {
      userName = storedUsers.userName;
      pass = storedUsers.pass;
      email = storedUsers.email;
    }
  } catch (error) {
    console.error("Failed To Recognize Users:", error);
  }
}

function saveUsers() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ userName, pass, email }));
}

loadUsers();

function Register() {
  loadUsers();

  let Username = document.getElementById("Username").value.trim();
  let Password = document.getElementById("Password").value;
  let Email = document.getElementById("Email").value.trim().toLowerCase();

  if (!Username || !Password || !Email) {
    alert("Please Enter Input");
    return;
  }

  if (!document.getElementById("Email").checkValidity()) {
    alert("Please enter a valid email address.");
    return;
  }

  if (userName.some((existingUsername) => existingUsername.toLowerCase() === Username.toLowerCase())) {
    alert("Username Already Exist");
    return;
  }

  if (email.some((existingEmail) => existingEmail.toLowerCase() === Email)) {
    alert("Email Already Exist");
    return;
  }

  userName.push(Username);
  email.push(Email);
  pass.push(Password);
  saveUsers();
  alert("Registration complete!");
  window.location.href = "PT.html";
}

async function ForgotPassword() {
  loadUsers();

  let inputEmail = document.getElementById("Email").value.trim().toLowerCase();
  let index = email.findIndex(
    (existingEmail) => existingEmail.toLowerCase() === inputEmail,
  );

  if (index !== -1) {
    const sent = await requestVerificationCode(inputEmail, "reset");

    if (!sent) {
      return;
    }

    localStorage.setItem(
      VERIFICATION_KEY,
      JSON.stringify({ type: "reset", email: inputEmail }),
    );
    showVerification("reset", inputEmail);
  } else {
    alert("Email not found.");
  }
}

async function requestVerificationCode(inputEmail, type) {
  if (window.location.protocol === "file:") {
    alert("Please open this site through http://localhost:3000 before resetting your password.");
    return false;
  }

  try {
    const response = await fetch(`${API_URL}/send-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: inputEmail, type }),
    });

    const responseText = await response.text();
    let result = {};

    if (responseText.trim()) {
      try {
        result = JSON.parse(responseText);
      } catch (error) {
        throw new Error(`The server returned an invalid response (${response.status}).`);
      }
    }

    if (!response.ok) {
      throw new Error(
        result.error || `Unable to send verification code (${response.status}).`,
      );
    }

    if (!result.sent) {
      throw new Error("The verification code could not be sent.");
    }

    return true;
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      alert("Cannot connect to the verification server. Start it with npm start, then try again.");
    } else {
      alert(error.message);
    }
    return false;
  }
}

function showVerification(type, inputEmail) {
  const verification = document.getElementById("verification");
  const message = document.getElementById("verification-message");

  if (!verification || !message) {
    alert(`A verification code has been sent to ${inputEmail}.`);
    return;
  }

  verification.hidden = false;
  verification.dataset.type = type;
  message.textContent = `A verification code has been sent to ${inputEmail}.`;
  document.getElementById("verification-code-1").focus();
}

async function verifyCode() {
  const enteredCode = [...document.querySelectorAll(".code-input")]
    .map((input) => input.value)
    .join("");
  const verificationRequest = JSON.parse(
    localStorage.getItem(VERIFICATION_KEY) || "null",
  );
  const request = verificationRequest;

  if (!request || !/^\d{6}$/.test(enteredCode)) {
    alert("Please enter the 6-digit verification code.");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/verify-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: request.Email || request.email, code: enteredCode }),
    });

    if (!response.ok) {
      alert("Invalid or expired verification code.");
      return;
    }
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      alert("Cannot connect to the verification server. Start it with npm start, then try again.");
    } else {
      alert("Verification service is unavailable.");
    }
    return;
  }

  const index = email.findIndex(
    (existingEmail) => existingEmail.toLowerCase() === request.email.toLowerCase(),
  );
  const newPassword = document.getElementById("NewPassword").value;

  if (!newPassword) {
    alert("Please enter a new password.");
    return;
  }

  pass[index] = newPassword;
  saveUsers();
  localStorage.removeItem(VERIFICATION_KEY);
  alert("Email verified. Password updated!");
  window.location.href = "PT.html";
}

document.addEventListener("input", (event) => {
  if (!event.target.matches(".code-input")) return;

  event.target.value = event.target.value.replace(/\D/g, "").slice(0, 1);
  if (event.target.value) {
    event.target.nextElementSibling?.focus();
  }
});

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Backspace" &&
    event.target.matches(".code-input") &&
    !event.target.value
  ) {
    event.target.previousElementSibling?.focus();
  }
});

function LogIn() {
  loadUsers();

  let inputUsername = document.getElementById("Username").value;
  let inputPassword = document.getElementById("Password").value;
  let inputEmail = document.getElementById("Email").value;
  let index = userName.indexOf(inputUsername);

  if (
    index !== -1 &&
    pass[index] === inputPassword &&
    email[index] === inputEmail
  ) {
    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ username: inputUsername, email: inputEmail }),
    );
    window.location.href = "Menu.html";
  } else {
    alert("Invalid username, password, or email.");
  }
}

function ClickRegister() {
  window.location.href = "Register.html";
}

function BackLogIn() {
  window.location.href = "PT.html";
}

function ClickCart() {
  const cartIcon = document.querySelector("#cart-icon");
  const cart = document.querySelector(".cart");
  const closeCart = document.querySelector("#close-cart");
}
