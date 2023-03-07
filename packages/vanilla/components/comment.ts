const pluralize = (n) => n + (n === 1 ? " reply" : " replies");

export function setupCommentToggle() {
  document.querySelectorAll("#toggle-click").forEach((el) => {
    el.addEventListener("click", function () {
      let parent = this as HTMLElement;
      while (parent.id != "toggle") {
        parent = parent.parentElement as HTMLElement;
      }

      const open = parent.getAttribute("data-open");
      const box = parent.querySelector("#toggle-box") as HTMLElement;
      const list = parent.querySelector("#toggle-ui") as HTMLElement;

      if (open === "false") {
        box.innerHTML = "[-]";
        list.style.display = "block";
      } else {
        box.innerHTML = "[+]";
        list.style.display = "none";
      }
      parent.setAttribute("data-open", open === "false" ? "true" : "false");
    });
  });
}

export default function Comment({ comment }) {
  return `<li class="comment">
      <div class="by">
        <a href="${`/users/${comment.user}`}">${comment.user}</a>
        ${comment.time_ago} ago
      </div>
      <div class="text">${comment.content}</div>
      ${
        comment.comments.length
          ? `
        <div id="toggle" data-open='false'>
          <div class="toggle">
            <a id="toggle-click">
              <span id="toggle-box">[+]</span> ${pluralize(comment.comments.length)} collapsed
            </a>
          </div>
          <ul id="toggle-ui" class="comment-children">${comment.comments
            .map((comment) => Comment({ comment }))
            .join(" ")}</ul>
        </div>`
          : ""
      }
    </li>`;
}
