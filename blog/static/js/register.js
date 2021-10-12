const form = document.getElementById("register-form");
const errorMessages = document.querySelectorAll(".error-message");
const usernames = JSON.parse(document.getElementById("usernames").value);
const emails = JSON.parse(document.getElementById("emails").value);
const inputs = document.querySelectorAll(
  "input:not(input[type=submit]):not(input[type=hidden])"
);

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function usernameValidate() {
  // Username validation
  if (usernames.includes(form.username.value)) {
    form.username.classList.add("error");
    errorMessages[0].style.display = "block";
    return false;
  }

  form.username.classList.remove("error");
  errorMessages[0].style.display = "none";
  return true;
}

function emailValidate() {
  // Email validation
  if (!validateEmail(form.email.value)) {
    form.email.classList.add("error");
    errorMessages[1].style.display = "block";
    return false;
  }

  for (const email of emails) {
    if (form.email.value == email) {
      return false;
    }
  }

  form.email.classList.remove("error");
  errorMessages[1].style.display = "none";
  return true;
}

function passwordValidate() {
  // Password validation
  if (form.confirm_password.value != form.password.value) {
    form.confirm_password.classList.add("error");
    errorMessages[2].style.display = "block";
    return false;
  }

  form.confirm_password.classList.remove("error");
  errorMessages[2].style.display = "none";
  return true;
}

const validate = () => {
  if (!(usernameValidate() && emailValidate() && passwordValidate()))
    return false;
  form.submit();
};

inputs[0].addEventListener("keyup", function () {
  this.classList.remove("error");
  errorMessages[0].style.display = "none";
});

inputs[1].addEventListener("keyup", function () {
  this.classList.remove("error");
  errorMessages[1].style.display = "none";
});

inputs[3].addEventListener("keyup", function () {
  this.classList.remove("error");
  errorMessages[2].style.display = "none";
});
