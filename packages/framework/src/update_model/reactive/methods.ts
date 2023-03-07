import { read, write, createComputation, isFunction, dispose, onDispose } from "./system";
import type { Effect, Signal, SignalMemoOptions, SignalOptions, SignalValue } from "./types";

export function signal<T>(): Signal<T | undefined>;
export function signal<T>(value: T, options?: SignalOptions<T>): Signal<T>;
export function signal<T>(initial?: SignalValue<T>, options?: SignalOptions<T>): Signal<T> {
  const n = createComputation(initial, null, options);

  // if the initial value is a compute - we say this is a
  // "computed" signal and will get react to it's _sources
  return n._computed ? read.bind(n) : [read.bind(n), (value: any) => write.apply(n, [value])];
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
    { ...options, _name: options?.id ?? "effect" }
  );

  n._effect = true;
  read.call(n);

  return function stopEffect() {
    dispose.call(n, true);
  };
}
