import { renderRoute } from "../helpers";

import Comment from "../components/comment";
import data from "./story.data";

function Story({ story }) {
  return `${
    story
      ? `<div class="item-view">
        <div class="item-view-header">
          <a href="${story.url}" target="_blank">
            <h1>${story.title}</h1>
          </a>
          ${story.domain ? `<span class="host">(${story.domain})</span>` : ``}
          <p class="meta">
            ${story.points || ""} points | by <a href=${`/users/${story.user}`}>${story.user}</a>
            ${story.time_ago} ago
          </p>
        </div>
        <div class="item-view-comments">
          <p class="item-view-comments-header">
            ${story.comments_count ? story.comments_count + " comments" : "No comments yet."}
          </p>
          <ul class="comment-children">
            ${story.comments.map((comment) => Comment({ comment })).join(" ")}
          </ul>
        </div>
      `
      : ""
  }`;
}

export default renderRoute(Story, { onMount: data });
