import type {
  ComponentIntrinsicElement,
  Func,
} from "~/reactive/render_model/types";

const createHtmlNode: Func<[ComponentIntrinsicElement], HTMLElement> =
  document.createElement.bind(document);

const createText: Func<[any], Text> = document.createTextNode.bind(document);

const createComment: Func<[], Comment> = document.createComment.bind(
  document,
  ""
);

export { createComment, createHtmlNode, createText };
