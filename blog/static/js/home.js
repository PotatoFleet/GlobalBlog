const blogs = document.querySelectorAll(".blog");
const sortButton = document.getElementById("sort-by");
const blogTitles = document.querySelectorAll(".blog-title");
const likeButtons = document.querySelectorAll(".like");
const messages = document.querySelector(".messages-container");
const filterForm = document.getElementById("filter-form");

const loggedIn =
  document.getElementById("logged-in").value == "" ? false : true;

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

const likedBlogs = loggedIn
  ? JSON.parse(document.getElementById("liked").value)
  : [];

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

for (const likedBlog of likedBlogs) {
  for (const blog of blogs) {
    const blog_id = parseInt(blog.querySelector(".blog-id").innerHTML);
    if (likedBlog == blog_id) {
      const l = blog.querySelector(".like");
      l.classList.add("dark");
      l.classList.remove("light");
    }
  }
}

for (const likeButton of likeButtons) {
  likeButton.addEventListener("click", () => {
    if (loggedIn) {
      for (const child of likeButton.parentElement.children) {
        if (child.classList.contains("likes")) {
          if (likeButton.classList.contains("dark")) {
            child.innerHTML = parseInt(child.innerHTML) - 1;
            likeButton.classList.add("light");
            likeButton.classList.remove("dark");
          } else {
            child.innerHTML = parseInt(child.innerHTML) + 1;
            likeButton.classList.add("dark");
            likeButton.classList.remove("light");
          }

          const data = new FormData();

          data.append("likes", parseInt(child.innerHTML));
          data.append(
            "id",
            parseInt(child.parentElement.parentElement.children[0].innerHTML)
          );

          $.ajax({
            url: new URL("/saveLikes/", window.location.origin).toString(),
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

document.querySelectorAll(".sort-option").forEach((el) => {
  el.addEventListener("click", () => {
    document.getElementById("sort").value = el.innerHTML;
    filterForm.submit();
  });
});

document.querySelectorAll(".show-option").forEach((el) => {
  el.addEventListener("click", () => {
    document.getElementById("show").value = el.innerHTML;
    filterForm.submit();
  });
});

const sortedBy = document.getElementById("sorted-by").value;

switch (sortedBy) {
  case "Latest":
    document.querySelectorAll(".sort-option")[0].classList.add("active");
    break;
  case "Most Liked":
    document.querySelectorAll(".sort-option")[1].classList.add("active");
    break;
}

if (loggedIn) {
  const showBy = document.getElementById("show-by").value;

  switch (showBy) {
    case "All Blogs":
      document.querySelectorAll(".show-option")[0].classList.add("active");
      break;
    case "Liked Blogs":
      document.querySelectorAll(".show-option")[1].classList.add("active");
      break;
    case "Your Blogs":
      document.querySelectorAll(".show-option")[2].classList.add("active");
      break;
  }
}
