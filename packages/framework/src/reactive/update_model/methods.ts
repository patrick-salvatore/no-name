import { read, write, createComputation, isFunction, dispose, onDispose, wrapSignal } from "./system";
import type { ComputationNode, Effect, ReadSignal, SignalMemoOptions, SignalOptions, SignalValue, WriteSignal } from "./types";

export function signal<T>(initial?: SignalValue<T>, options?: SignalOptions<T>) {
  const node = createComputation(initial, null, options);

  return [wrapSignal(read.bind(node)), write.bind(node) as WriteSignal<T>["set"]];
}

export function memo<T, R = never>(compute: () => T, options?: SignalMemoOptions<T, R>) {
  const n = createComputation<T | R>(options?.initial as R, compute, options as SignalOptions<T | R>)
  const signal = read.bind(n) as ReadSignal<T | R>;
  signal.node = n;

  return wrapSignal(signal);
}

export function effect(effect: Effect, options?: any) {
  const n = createComputation<null>(
    null,
    () => {
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
