import type { FunctionMaybe } from "~/render_model/types";
import { isArray, isFunction } from "~/render_model/utils";

const resolveArrays = (() => {
  const RESOLVED = [];

  const inner = (values: any[], resolved: any[], isDynamic: boolean): [any[], boolean] => {
    for (let i = 0, l = values.length; i < l; ++i) {
      const value = values[i];
      const type = typeof value;

      if (type === "function") {
        if (resolved !== RESOLVED) resolved.push(value);

        isDynamic = true;
      } else {
        if (resolved !== RESOLVED) resolved.push(value);
      }
    }

    if (resolved === RESOLVED) resolved = values;

    return [resolved, isDynamic];
  };

  return (values: any[]): [any[], boolean] => {
    return inner(values, RESOLVED, false);
  };
})();

type Setter<T> = (value: T | T[], dynamic: boolean) => void;

const resolveChild = <T>(value: FunctionMaybe<T>, setter: Setter<T>, _dynamic: boolean = false): void => {
  if (isFunction(value)) {
    resolveChild(value(), setter, true);
  } else if (isArray(value)) {
    const [values, isDynamic] = resolveArrays(value);
    setter(values, isDynamic || _dynamic);
  } else {
    setter(value, _dynamic);
  }
};

export { resolveChild };
