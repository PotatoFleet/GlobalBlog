const blogs = document.querySelectorAll(".blog");
const sortButton = document.getElementById("sort-by");
const sortOptions = document.querySelector(".sort-options");
const blogTitles = document.querySelectorAll(".blog-title");
const likeButtons = document.querySelectorAll(".like");
const messages = document.querySelector(".messages-container");

const loggedIn = true;

const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const keys = {
  "~t": "&emsp;&emsp;",
  "~n": "<br>",
  "~b": "<b>",
  "~eb": "</b>",
  "~i": "<i>",
  "~ei": "</i>",
  "~ef": "</span>",
};

if (blogs.length > 20) {
  for (const blog of blogs.slice(20, blogs.length)) {
    blog.style.display = "none";
  }
}

for (const blog of blogs) {
  for (const child of blog.children) {
    if (child.classList.contains("blog-content")) {
      let blogText = child;
      for (let i = 0; i < blogText.innerHTML.length - 1; i++) {
        if (blogText.innerHTML[i] + blogText.innerHTML[i + 1] == "~f") {
          let fontSize = "";

          for (
            let j = i + 2;
            j < i + 5 && digits.includes(parseInt(blogText.innerHTML[j]));
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
    }
  }
}

for (const blog of blogs) {
  for (const child of blog.children) {
    if (child.classList.contains("blog-content")) {
      let blogText = child;
      for (const [key, value] of Object.entries(keys)) {
        blogText.innerHTML = blogText.innerHTML.replaceAll(key, value);
      }
    }
    if (child.classList.contains("blog-likes")) {
      child.children[0].style.color = "black";
    }
  }
}

for (const title of blogTitles) {
  title.addEventListener("click", function () {
    for (const child of title.parentElement.children) {
      if (child.classList.contains("blog-id")) {
        window.location.href = "/blog/" + child.innerHTML;
      }
    }
  });
}

for (const likeButton of likeButtons) {
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
      message.classList.add("message");
      message.classList.add("error-message");
      message.textContent = "You need to be logged in to like blogs";

      messages.appendChild(message);
    }
  });
}
