import type { FunctionMaybe } from "~/render_model/types";
import { isArray, isFunction } from "~/render_model/utils";

import { effect } from "~/update_model";
import { $SIGNAL, $TRACKING } from "~/update_model/reactive/system";

import { createText } from "./utils/creators";

const resolveArrays = (() => {
  const RESOLVED = [];

  const inner = (values: any[], resolved: any[], hasObservables: boolean): [any[], boolean] => {
    for (let i = 0, l = values.length; i < l; i++) {
      const value = values[i];
      const type = typeof value;

      if (type === "string" || type === "number" || type === "bigint") {
        // Static

        if (resolved === RESOLVED) resolved = values.slice(0, i);

        resolved.push(createText(value));
      } else if (type === "object" && isArray(value)) {
        // Array

        if (resolved === RESOLVED) resolved = values.slice(0, i);

        hasObservables = inner(value, resolved, hasObservables)[1];
      } else if (type === "function" && value[$SIGNAL]) {
        // Signal

        if (resolved !== RESOLVED) resolved.push(value);

        hasObservables = true;
      } else {
        // Something else

        if (resolved !== RESOLVED) resolved.push(value);
      }
    }

    if (resolved === RESOLVED) resolved = values;

    return [resolved, hasObservables];
  };

  return (values: any[]): [any[], boolean] => {
    return inner(values, RESOLVED, false);
  };
})();

type Setter<T> = (value: T | T[], dynamic: boolean) => void;

const resolveChild = <T>(value: FunctionMaybe<T>, setter: Setter<T>, _dynamic: boolean = false): void => {
  if (isFunction(value)) {
    if (value[$SIGNAL]) {
      effect(
        () => {
          resolveChild(value(), setter, true);
        },
        { name: "resolveChild_effect" }
      );
    } else {
      resolveChild(value(), setter, true);
    }
  } else if (isArray(value)) {
    const [values, isDynamic] = resolveArrays(value);
    setter(values, isDynamic || _dynamic);
  } else {
    setter(value, _dynamic);
  }
};

export { resolveChild };
