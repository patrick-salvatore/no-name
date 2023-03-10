import type { Child } from "~/reactive/render_model/types";

import { setChildren } from "~/reactive/render_model/utils/setters";
import { root } from "~/reactive/update_model";

// "entry point" for app. This functions takes a Html root element, and the app component.
const render = (component: Child, parent: Element) => {
  if (!parent || !(parent instanceof HTMLElement))
    throw new Error("Invalid parent node");

  parent.innerText = "";

  return root((dipose) => {
    // recursively go through children mounting
    // elements to the parent
    setChildren(parent, component);

    return (): void => {
      dipose();
      parent.textContent = "";
    };
  });
};

export default render;
