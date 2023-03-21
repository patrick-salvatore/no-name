import type { Ref } from "../types";

export function ref<T = any>(): Ref<T> {
  return { current: null };
}
