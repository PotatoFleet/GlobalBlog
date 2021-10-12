const blogText = document.querySelector(".blog-main");
const likeButton = document.querySelector(".like");
const editButton = document.querySelector(".edit-blog");
const deleteButton = document.getElementById("delete");
const messages = document.querySelector(".messages-container");
const blogId = document.querySelector(".blog-id").innerHTML;

const likedBlog =
  document.getElementById("liked-blog").value == "True" ? true : false;

const loggedIn =
  document.getElementById("logged-in").value == "" ? false : true;

const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

// Blog language formatting
const keys = {
  "~t": "&emsp;&emsp;",
  "~n": "<br>",
  "~b": "<b>",
  "~eb": "</b>",
  "~i": "<i>",
  "~ei": "</i>",
  "~ef": "</span>",
};

blogText.innerHTML.trim();

// Font formatting
if (blogText.innerHTML.includes("~f")) {
  for (let i = 0; i < blogText.innerHTML.length - 1; i++) {
    if (blogText.innerHTML[i] + blogText.innerHTML[i + 1] != "~f") continue;
    let fontSize = "";

    for (
      let j = i + 2; // only 2 digit numbers
      j < i + 4 && digits.includes(parseInt(blogText.innerHTML[j]));
      j++
    ) {
      fontSize += blogText.innerHTML[j];
    }

    blogText.innerHTML = blogText.innerHTML.replace(
      `~f${fontSize}`,
      `<span style='font-size: ${fontSize}px'>`
    );
  }
}

// Formatting Other
for (const [key, value] of Object.entries(keys)) {
  blogText.innerHTML = blogText.innerHTML.replaceAll(key, value);
}

// Auto liking button if already liked
if (likedBlog) likeButton.style.color = "black";

// Blog liking
likeButton.addEventListener("click", () => {
  if (loggedIn) {
    for (const child of likeButton.parentElement.children) {
      if (child.classList.contains("likes")) {
        if (likeButton.style.color == "black") {
          child.innerHTML = parseInt(child.innerHTML) - 1;
          likeButton.style.color = "gray";
        } else {
          child.innerHTML = parseInt(child.innerHTML) + 1;
          likeButton.style.color = "black";
        }

        const data = new FormData();

        data.append("likes", parseInt(child.innerHTML));
        data.append(
          "id",
          parseInt(child.parentElement.parentElement.children[0].innerHTML)
        );

        $.ajax({
          url: "http://127.0.0.1:5000/saveLikes/",
          processData: false,
          contentType: false,
          type: "POST",
          data: data,
        });
      }
    }
  } else {
    message = document.createElement("span");
    message.classList.add("message", "error-message");
    message.textContent = "You need to be logged in to like blogs";

    messages.appendChild(message);
  }
});

// Edit button js
editButton.addEventListener("click", () => {
  window.location.href = `/editBlog/${blogId}`;
});

// Making sure that the delete button exists, if not, you don't own the
// blog and raises an error
if (deleteButton != null) {
  document.getElementById("delete").addEventListener("click", () => {
    window.location.href = `/deleteBlog/${blogId}`;
  });
}
