const form = document.getElementById("reset-form");

form.addEventListener("submit", () => {
  if (form.new_password.value != form.confirm_password.value) return false;
  form.submit();
});
