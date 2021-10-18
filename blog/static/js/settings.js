const pfp = document.getElementById("pfp");
const fileInput = document.getElementById("file-input");

fileInput.addEventListener("change", function () {
  const [file] = this.files;

  if (file) {
    const data = new FormData();

    data.append("img", file);

    src = URL.createObjectURL(file);
    pfp.src = src;

    $.ajax({
      url: new URL('/settings/savePicture/', window.location.origin).toString(),
      processData: false,
      contentType: false,
      type: "POST",
      data: data,
    });
  }
});


// Edit username
document.getElementById('edit-username').addEventListener('click', () => {
})