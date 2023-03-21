import wrapElement from "~/reactive/render_model/utils/wrap_element";
import { createHtmlNode } from "~/reactive/render_model/utils/creators";
import { setChildren, setProp } from "~/reactive/render_model/utils/setters";
import {
  isFunction,
  isNil,
  isString,
  isNode,
  isVoidChild,
} from "~/reactive/render_model/utils";

import type { Child, Component, Props } from "~/reactive/render_model/types";

import { untrack } from "~/reactive/update_model/system";

// This function is exported from the framework, and manually injected into the bundle in user land.
// We rely on vite's esbuild feature set, to invoke this function for every JSX tag in the user's app.
function createElement<P = {}>(
  component: Component<P>,
  props: P | null,
  ..._children: Child[]
) {
  const { children: __children, key, ref, ...rest } = (props || {}) as Props; // TSC
  const children =
    _children.length === 1
      ? _children[0]
      : _children.length === 0
      ? __children
      : _children;

  if (isFunction(component)) {
    const props = rest;

    if (!isNil(children)) props.children = children;
    if (!isNil(ref)) props.ref = ref;

    return wrapElement(() =>
      untrack(
        () => component.call(component, props as P) // TSC
      )
    );
  } else if (isString(component)) {
    const props = rest;
    if (!isVoidChild(children)) props.children = children;
    if (!isNil(ref)) props.ref = ref;

    return wrapElement((): Child => {
      const child = createHtmlNode(component) as HTMLElement; // TSC

      untrack(() => {
        for (const key in props) {
          if (key === "children") {
            setChildren(child, props.children);
          } else {
            setProp(child, key, props[key]);
          }
        }
      });

      return child;
    });
  } else if (isNode(component)) {
    return wrapElement(() => component);
  } else {
    throw new Error("Invalid component");
  }
}

export default createElement;
