import { read, write, createComputation, isFunction, dispose, onDispose, $SIGNAL } from "./system";
import type { Effect, SignalMemoOptions, SignalOptions, SignalValue, WriteSignal } from "./types";

export function signal<T>(initial?: SignalValue<T>, options?: SignalOptions<T>) {
  const node = createComputation(initial, null, options);

  const reader = read.bind(node);
  reader[$SIGNAL] = true;

  return [reader, write.bind(node) as WriteSignal<T>["set"]];
}

export function memo<T, R = never>(compute: () => T, options?: SignalMemoOptions<T, R>) {
  return () => read.bind(createComputation<T | R>(options?.initial as R, compute, options as SignalOptions<T | R>));
}

export function effect(effect: Effect, options?: any) {
  const n = createComputation<null>(
    null,
    function runEffect() {
      let effectResult = effect();
      isFunction(effectResult) && onDispose(effectResult);
      return null;
    },
    { ...options, _name: options?.name ?? "effect" }
  );

  n._effect = true;
  read.call(n);

  return function stopEffect() {
    dispose.call(n, true);
  };
}
