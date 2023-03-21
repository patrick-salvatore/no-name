import {
  read,
  write,
  createComputation,
  isFunction,
  dispose,
  onDispose,
  wrapSignal,
  Selector,
  untrack,
} from "./system";
import type {
  Effect,
  ReadSignal,
  SignalMemoOptions,
  SignalOptions,
  SignalValue,
  WriteSignal,
} from "./types";

export function signal<T>(
  initial?: SignalValue<T>,
  options?: SignalOptions<T>
) {
  const node = createComputation(initial, null, options);
  return [
    wrapSignal(read.bind(node)),
    write.bind(node) as WriteSignal<T>["set"],
  ];
}

export function memo<T, R = never>(
  compute: () => T,
  options?: SignalMemoOptions<T, R>
) {
  const n = createComputation<T | R>(
    options?.initial as R,
    compute,
    options as SignalOptions<T | R>
  );
  const signal = read.bind(n) as ReadSignal<T | R>;
  signal.node = n;

  return wrapSignal(signal);
}

export function effect(fn: Effect, options?: any) {
  const n = createComputation<null>(
    null,
    function () {
      let effectResult = fn();
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

export function selector<T>(source: ReadSignal<T>) {
  let currentKey: T | undefined,
    nodes = new Map<T, Selector<T>>();

  effect(() => {
    const newKey = source();
    const prev = nodes.get(currentKey!);
    const next = nodes.get(newKey);

    prev && write.call(prev, false);
    next && write.call(next, true);
    currentKey = newKey;
  });

  return function observeSelector(key: T) {
    let node = nodes.get(key);

    if (!node) {
      nodes.set(key, (node = new Selector(key, key === currentKey, nodes)));
    }

    node!._refs += 1;
    onDispose(node);

    return wrapSignal(read.bind(node!));
  };
}

export function on(deps, fn, options?) {
  const isArray = Array.isArray(deps);
  let prevInput;
  let defer = options && options.defer;

  return () => {
    let input;

    if (isArray) {
      input = Array(deps.length);
      for (let i = 0; i < deps.length; i++) input[i] = deps[i]();
    } else {
      input = deps();
    }

    if (defer) {
      defer = false;
      return undefined;
    }
    const result = untrack(() => fn(input, prevInput));
    prevInput = input;
    return result;
  };
}
