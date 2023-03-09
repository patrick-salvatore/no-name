import type { Maybe, ReadSignal } from "~/update_model/reactive/types";
import { computedMap } from "~/update_model";

import { computedKeyedMap, unwrap } from "~/update_model/reactive";

export function For<Item, Element extends JSX.Element>(props: {
  each: Maybe<Item[] | ReadSignal<Item[]>>;
  children: (item: ReadSignal<Item>, index: number) => Element;
}) {
  return computedMap(() => unwrap(props.each), props.children, {
    name: "For",
  });
}

export function ForKeyed<Item, Element extends JSX.Element>(props: {
  each: Maybe<Item[] | ReadSignal<Item[]>>;
  $children: (item: Item, index: ReadSignal<number>) => Element;
}) {
  // return computedKeyedMap(() => unwrap(props.each), unwrap(props.$children), {
  //   name: "ForKeyed",
  // });
}
