import { renderRoute } from "../helpers";
import data from "./users.data";

function User({ user }) {
  return `<div class="user-view">
  ${
    user
      ? !user.error
        ? `<h1>User : ${user.id}</h1>
      <ul class="meta">
        <li>
          <span class="label">Created:</span> ${user.created}
        </li>
        <li>
          <span class="label">Karma:</span> ${user.karma}
        </li>
        ${user.about ? `<li class="about">${user.about}</li>` : ""}
      </ul>
      <p class="links">
        <a href=${`https://news.ycombinator.com/submitted?id=${user.id}`}>submissions</a> |
        <a href=${`https://news.ycombinator.com/threads?id=${user.id}`}>comments</a>
      </p>`
        : `<h1>User not found.</h1>`
      : ""
  }
    </div>`;
}

export default renderRoute(User, { onMount: data });
