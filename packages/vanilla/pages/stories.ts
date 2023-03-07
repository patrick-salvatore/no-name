import { renderRoute } from "../helpers";

import data from "./stories.data";

import Story from "../components/story";

const Stories = ({ stories } = {} as any, { query, params: { path } }) => {
  path = path.split("/")[1];

  return `
  <div class="news-view">
    <div class="news-list-nav">
      ${
        +query.get("page")
          ? `
          <a
            class="page-link"
            href=${`/${path}?page=${(+query.get("page") || 1) - 1}`}
            aria-label="Previous Page"
          >
            < prev
          </a>`
          : `<span class="page-link disabled" aria-hidden="true">&lt; prev</span>`
      }<span>page ${+query.get("page") || 1}</span>${
    stories?.length >= 28
      ? `<a
              class="page-link"
              href=${`/${path}?page=${(+query.get("page") || 1) + 1}`}
              aria-label="Next Page"
            >
              more >
            </a>`
      : `<span class="page-link disabled" aria-hidden="true">more &gt;</span>`
  }
    </div>
    <main class="news-list">
    ${
      stories.length
        ? `<ul>
            ${stories.map((story) => Story({ story })).join(" ")}
          </ul>`
        : ""
    }
    </main>
  </div>`;
};

export default renderRoute(Stories, { onMount: data });
