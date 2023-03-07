import { resolveChild } from "~/render_model/resolver";
import { isNil } from "~/render_model/utils";

import type { Child } from "~/render_model/types";
import { createText } from "~/render_model/utils/creators";

const setStyles = (element: HTMLElement, stylesString: string) => {
  element.setAttribute("style", stylesString);
};

const setClass = (element: HTMLElement, _class: Record<string, string | boolean> | string) => {
  if (typeof _class === "object") {
    for (const key in _class) {
      if (_class[key]) {
        element.classList.toggle(key);
      }
    }
    return;
  }

  element.className = _class;
};

const setAttribute = (() => {
  const attributesBoolean = new Set([
    "allowfullscreen",
    "async",
    "autofocus",
    "autoplay",
    "checked",
    "controls",
    "default",
    "disabled",
    "formnovalidate",
    "hidden",
    "indeterminate",
    "ismap",
    "loop",
    "multiple",
    "muted",
    "nomodule",
    "novalidate",
    "open",
    "playsinline",
    "readonly",
    "required",
    "reversed",
    "seamless",
    "selected",
  ]);

  return (element: HTMLElement, key: string, value: null | undefined | boolean | number | string): void => {
    if (isNil(value) || (value === false && attributesBoolean.has(key))) {
      element.removeAttribute(key);
    } else {
      value = value === true ? "" : String(value);

      element.setAttribute(key, value);
    }
  };
})();

const setEvent = (() => {
  const delegatedEvents = <const>{
    onbeforeinput: ["_onbeforeinput", false],
    onclick: ["_onclick", false],
    ondblclick: ["_ondblclick", false],
    oninput: ["_oninput", false],
    onkeydown: ["_onkeydown", false],
    onkeyup: ["_onkeyup", false],
    onmousedown: ["_onmousedown", false],
    onmouseup: ["_onmouseup", false],
  };

  const delegate = (event: string): void => {
    const key = `_${event}`;

    document.addEventListener(event.slice(2), (event) => {
      const targets = event.composedPath();

      let target: EventTarget | null = null;

      Object.defineProperty(event, "currentTarget", {
        configurable: true,
        get() {
          return target;
        },
      });

      for (let i = 0, l = targets.length; i < l; i++) {
        target = targets[i];

        const handler = target[key];

        if (!handler) continue;

        handler(event);

        if (event.cancelBubble) break;
      }

      target = null;
    });
  };

  return (element: HTMLElement, event: string, value: null | undefined | EventListener): void => {
    const delegated = delegatedEvents[event];

    if (delegated) {
      if (!delegated[1]) {
        // Not actually delegating yet

        delegated[1] = true;

        delegate(event);
      }

      element[delegated[0]] = value;
    } else {
      element[event] = value;
    }
  };
})();

const setProp = (element: HTMLElement, key: string, value: any): void => {
  if (key === "children") {
    setChildren(element, value);
  } else if (key === "style") {
    setStyles(element, value);
  } else if (key === "class") {
    setClass(element, value);
  } else if (key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110) {
    setEvent(element, key.toLowerCase(), value);
  } else {
    setAttribute(element, key, value);
  }
};

const setProps = (element: HTMLElement, object: Record<string, unknown>): void => {
  for (const key in object) {
    setProp(element, key, object[key]);
  }
};

const setStatic = (parent: HTMLElement, child: Child): void => {
  if (child === undefined) return;

  const type = typeof child;

  if (type === "string" || type === "number" || type === "bigint") {
    const textNode = createText(child);
    parent.appendChild(textNode);
    return;
  } else if (type === "object" && child !== null && typeof (child as Node).nodeType === "number") {
    const node = child as Node;
    parent.insertBefore(node, null);
    return;
  }

  const children = (Array.isArray(child) ? child : [child]) as Node[]; // TSC

  for (let i = 0, l = children.length; i < l; ++i) {
    const child = children[i];
    const childType = typeof child;
    if (childType === "string" || childType === "number" || childType === "bigint") {
      parent.appendChild(createText(child));
    } else if (childType === "object" && child !== null && typeof child.nodeType === "number") {
      const node = child as Node;
      parent.insertBefore(node, null);
    } else if (childType === "function") {
      resolveChild(child, setStatic.bind(undefined, parent));
    }
  }
};

const setChildren = (parent: HTMLElement, child: Child) => {
  resolveChild(child, setStatic.bind(undefined, parent));
};

export { setChildren, setProps };
