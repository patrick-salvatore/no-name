import { isNil } from "~/render_model/utils";
import { createText, createComment } from "~/render_model/utils/creators";

import CashUtils from "~/render_model/utils/cashUtil";

import type { Cash, Child } from "~/render_model/types";

import { resolveChild } from "~/render_model/utils/resolver";

import { SYMBOL_UNCACHED } from "../constants";
import diff from "./diff";

const setStyles = ( element: HTMLElement, stylesString: string ) => {
  element.setAttribute( "style", stylesString );
};

const setClass = ( element: HTMLElement, _class: Record<string, string | boolean> | string ) => {
  if ( typeof _class === "object" ) {
    for ( const key in _class ) {
      if ( _class[key] ) {
        element.classList.toggle( key );
      }
    }
    return;
  }

  element.className = _class;
};

const setAttribute = ((  ) => {
  const attributesBoolean = new Set( [
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
  ] );

  return ( element: HTMLElement, key: string, value: null | undefined | boolean | number | string ): void => {
    if ( isNil( value ) || ( value === false && attributesBoolean.has( key ) ) ) {
      element.removeAttribute( key );
    } else {
      value = value === true ? "" : String( value );

      element.setAttribute( key, value );
    }
  };
} )(  );

const setEvent = ( (  ) => {
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

  const delegate = ( event: string ): void => {
    const key = `_${event}`;

    document.addEventListener( event.slice( 2 ), ( event ) => {
      const targets = event.composedPath(  );

      let target: EventTarget | null = null;

      Object.defineProperty( event, "currentTarget", {
        configurable: true,
        get(  ) {
          return target;
        },
      } );

      for ( let i = 0, l = targets.length; i < l; i++ ) {
        target = targets[i];

        const handler = target[key];

        if ( !handler ) continue;

        handler( event );

        if ( event.cancelBubble ) break;
      }

      target = null;
    } );
  };

  return ( element: HTMLElement, event: string, value: null | undefined | EventListener ): void => {
    const delegated = delegatedEvents[event];

    if ( delegated ) {
      if ( !delegated[1] ) {
        // Not actually delegating yet

        delegated[1] = true;

        delegate( event );
      }

      element[delegated[0]] = value;
    } else {
      element[event] = value;
    }
  };
} )(  );

const setProp = ( element: HTMLElement, key: string, value: any ): void => {
  if ( key === "children" ) {
    setChildren( element, value );
  } else if ( key === "style" ) {
    setStyles( element, value );
  } else if ( key === "class" ) {
    setClass( element, value );
  } else if ( key.charCodeAt( 0 ) === 111 && key.charCodeAt( 1 ) === 110 ) {
    setEvent( element, key.toLowerCase(  ), value );
  } else {
    setAttribute( element, key, value );
  }
};

const setProps = ( element: HTMLElement, object: Record<string, unknown> ): void => {
  for ( const key in object ) {
    setProp( element, key, object[key] );
  }
};

const setChildReplacementText = ( child: string, prev: Node): Node => {
  if ( prev.nodeType === 3 ) {

    prev.nodeValue = String(child);

    return prev;

  } else {

    const parent = prev.parentElement;

    if ( !parent ) throw new Error( 'Invalid child replacement' );

    const textNode = createText( child );

    parent.replaceChild( textNode, prev );

    return textNode;
  }
}

const setStatic = ( parent: HTMLElement, cash: Cash, child: Child, dynamic: boolean): void => {
  if ( !dynamic && child === undefined ) return;

  const prev = CashUtils.getChildren( cash );
  const prevIsArray = prev instanceof Array;
  const prevLength = prevIsArray ? prev.length : 1;
  const prevFirst = prevIsArray ? prev[0] : prev;
  const prevLast = prevIsArray ? prev[prevLength - 1] : prev;
  const prevSibling = prevLast?.nextSibling || null;

  // First time setting node
  if ( prevLength === 0 ) {
    const type = typeof child;

    if ( type === "string" || type === "number" || type === "bigint" ) {
      const textNode = createText( child );

      parent.appendChild( textNode );
      CashUtils.replaceWithNode( cash, textNode );

      return;
    } else if ( type === "object" && child !== null && typeof ( child as Node ).nodeType === "number" ) {
      const node = child as Node;

      parent.insertBefore( node, null );
      CashUtils.replaceWithNode( cash, node );

      return;
    }
  }

  // First time setting node
  if ( prevLength === 1 ) {
    const node = setChildReplacementText( String(child), prevFirst );

    CashUtils.replaceWithNode( cash, node );

    return;
  }

  const nextCash = CashUtils.make();
  const children = ( Array.isArray( child ) ? child : [child] ) as Node[]; // TSC

  let nextHasStaticChildren = false;

  for ( let i = 0, l = children.length; i < l; ++i ) {
    const child = children[i];
    const childType = typeof child;

    if ( childType === "string" || childType === "number" || childType === "bigint" ) {

      nextHasStaticChildren = true;

      CashUtils.pushNode ( nextCash, createText( child ) );

    } else if ( childType === "object" && child !== null && typeof child.nodeType === "number" ) {

      nextHasStaticChildren = true;

      CashUtils.pushNode ( nextCash, child );

    } else if ( childType === "function" ) {
      const c = CashUtils.make ();

      CashUtils.pushCash( nextCash, c );

      resolveChild( child, setStatic.bind( undefined, parent, c ) );
    }
  }

  let next = CashUtils.getChildren ( nextCash );
  let nextLength = nextCash.length;
  let nextHasDynamicChildren = !nextHasStaticChildren && nextLength > 0; // Just a heuristic, not exact, good enough

  if ( nextLength === 0 && prevLength === 1 && prevFirst.nodeType === 8 ) { // It's a placeholder already, no need to replace it
    return;
  }

  if ( nextLength === 0 || ( prevLength === 1 && prevFirst.nodeType === 8 ) || children[SYMBOL_UNCACHED] ) { // Fast path for removing all children and/or replacing the placeholder
    const {childNodes} = parent;

    if ( childNodes.length === prevLength ) { // Maybe this cash doesn't handle all children but only a range of them, checking for that here
      parent.textContent = '';

      if ( nextLength === 0 ) { // Placeholder, to keep the right spot in the array of children
        const placeholder = createComment();

        CashUtils.pushNode( nextCash, placeholder );

        if ( next !== nextCash.values ) {
          next = placeholder;
          nextLength += 1;
        }

      }

      if ( prevSibling ) {
        if ( next instanceof Array ) {
          prevSibling.before.apply ( prevSibling, next );
        } else {
          parent.insertBefore ( next, prevSibling );
        }
      } else {
        if ( next instanceof Array ) {
          parent.append.apply ( parent, next );
        } else {
          parent.append ( next );
        }

      }

      CashUtils.replaceWithCash( cash, nextCash );

      return;
    }
  }

  if ( nextLength === 0 ) { // Placeholder, to keep the right spot in the array of children
    const placeholder = createComment();

    CashUtils.pushNode( nextCash, placeholder );

    if ( next !== nextCash.values ) {
      next = placeholder;
      nextLength += 1;
    }
  }

  // // Some diffs can be safely skipped, if we only added some dynamic children already
  // // FIXME: Children added dynamically must be taken into account perfectly though,
  // // this most probably isn't perfect, "prev" may not be representative of the current state, when dynamic children are added
  if ( prevLength > 0 || nextHasStaticChildren || !nextHasDynamicChildren ) {
    try {
      diff( parent, prev, next, prevSibling );
    } catch( error: unknown ) {
      throw error;
    }
  }

  CashUtils.replaceWithCash( cash, nextCash );
};

const setChildren = ( parent: HTMLElement, child: Child, cash: Cash = CashUtils.make () ) => {
  resolveChild( child, setStatic.bind( undefined, parent, cash ) );
};

export { setChildren, setProps };
