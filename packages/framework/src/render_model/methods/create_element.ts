import wrapElement from "~/render_model/methods/wrap_element";
import { createHtmlNode } from "~/render_model/utils/creators";
import { setProps } from "~/render_model/utils/setters";
import { isFunction, isNil, isString, isNode, isVoidChild } from "~/render_model/utils";
import type { Child, Component, Props } from "~/render_model/types";

import { untrack } from "~/update_model/reactive/system";

// This function is exported from the framework, and manually injected into the bundle in user land.
// We rely on vite's esbuild feature set, to invoke this function for every JSX tag in the user's app.
function createElement<P = {}>(component: Component<P>, props: P | null, ..._children: Child[]) {
  const { children: __children, key, ref: _, ...rest } = (props || {}) as Props; // TSC
  const children = _children.length === 1 ? _children[0] : _children.length === 0 ? __children : _children;

  if (isFunction(component)) {
    const props = rest;

    if (!isNil(children)) props.children = children;

    return wrapElement(() =>
      untrack(
        () => component.call(component, props as P) // TSC
      )
    );
  } else if (isString(component)) {
    const props = rest;
    if (!isVoidChild(children)) props.children = children;

    return wrapElement((): Child => {
      const child = createHtmlNode(component) as HTMLElement; // TSC

      untrack(() => setProps(child, props));

      return child;
    });
  } else if (isNode(component)) {
    return wrapElement(() => component);
  } else {
    throw new Error("Invalid component");
  }
}

/* EXPORT */

export default createElement;
