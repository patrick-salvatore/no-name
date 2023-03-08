import Story from "./pages/story";
import User from "./pages/user";
import Stories from "./pages/stories";

import nav from "./components/nav";
import { setupCommentToggle } from "./components/comment";

const routes = {
  "/": Stories,
  "/top": Stories,
  "/new": Stories,
  "/show": Stories,
  "/ask": Stories,
  "/job": Stories,
  "/stories/:id": Story,
  "/users/:id": User,
};
const routesSearchTree = createRoutesSearchTree(routes);
const app = document.getElementById("app") as HTMLElement;
const template = nav();

function createRoutesSearchTree(r: typeof routes) {
  const root = "/";
  const tree = {
    name: root,
    children: null,
    c: routes[root],
  } as any;

  let current = tree;

  for (const key of Object.keys(routes)) {
    const path = key.split("/").filter(Boolean);
    const comp = routes[key];

    let p;
    while ((p = path.shift())) {
      if (!p) continue;

      const node = {
        name: p,
      };

      if (Array.isArray(current.children)) {
        current.children.push(node);
      } else {
        current.children = [node];
      }

      current = node;
    }

    current.c = comp;
    current = tree;
  }

  return tree;
}

function findPage(parts) {
  let node = routesSearchTree;
  let n;

  if (parts === "/") {
    return node;
  }

  for (let i = 0; i < parts.length; ++i) {
    const found = node?.children?.find?.((n) => n.name === parts[i]);
    const slug = node?.children?.find?.((n) => n.name.startsWith(":"));

    if (found) {
      node = found;
      n = found;
    } else if (slug) {
      node = slug;
      n = slug;
    }
  }

  return n || { c: () => Promise.resolve(`<h1>404</h1>`) };
}

function render(root: HTMLElement, t: string) {
  root.innerHTML = t.replace("\n", "");
}

const url = new URL(window.location.href);
const parts = url.pathname.split("/").filter(Boolean);

findPage(parts.length ? parts : "/")
  .c({ query: url.searchParams, params: { path: url.pathname } })
  .then((component: string) => {
    render(app, template + component);
    setupCommentToggle();
  });
