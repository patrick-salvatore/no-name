import fetchAPI from "@lnl/lib";

const mapStories = {
  "/top": "news",
  "/new": "newest",
  "/show": "show",
  "/ask": "ask",
  "/job": "jobs",
};

export default async function data({ query, params }) {
  const page = +(query.get("page") || 1);
  const type = params.path in mapStories ? params.path : "/top";
  const stories = await fetchAPI(`${mapStories[type]}?page=${page}`);

  return { type, stories, page };
}
