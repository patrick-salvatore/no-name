import type { Child } from "../render_model/types";
import { memo } from "../update_model";
import { untrack } from "../update_model/system";
import type { ReadSignal } from "../update_model/types";

const For = function For<T>({
  each,
  fallback,
  children,
}: {
  each: ReadSignal<readonly T[]>;
  children: (value: T, index: ReadSignal<number>) => Child;
  fallback?: Child;
}) {
  return memo(
    () => {
      const array = each();

      return untrack(() => {
        const results = [];
        for (let i = 0; i < array.length; ++i) {
          // @ts-expect-error
          results.push(children(array[i], () => i));
        }
        return results;
      });
    },
    { name: "For" }
  );
};

export { For };
