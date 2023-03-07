import type { ComponentIntrinsicElement, Func } from "~/render_model/types";

const createHtmlNode: Func<[ComponentIntrinsicElement], HTMLElement> = document.createElement.bind(document);

const createText: Func<[any], Text> = document.createTextNode.bind(document);

export { createHtmlNode, createText };
