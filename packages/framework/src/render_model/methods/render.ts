import type { Child } from "~/render_model/types";

import { setChildren } from "~/render_model/utils/setters";

import { root } from "~/update_model/reactive";

// "entry point" for app. This functions takes a Html root element, and the app component.
const render = (component: Child, parent: Element) => {
  if (!parent || !(parent instanceof HTMLElement)) throw new Error("Invalid parent node");

  parent.innerText = "";

  return root((dipose) => {
    setChildren(parent, component);

    return (): void => {
      dipose();
      parent.textContent = "";
    };
  });
};

export default render;
