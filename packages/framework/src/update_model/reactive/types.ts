import type { SCOPE } from "./system";

type Callable<This = unknown, Return = void> = {
  call($this: This): Return;
};

type ContextRecord = Record<string | symbol, unknown>;

interface ComputationNode<T = any> extends Scope {
  _name?: string | undefined;

  _effect: boolean;

  _init: boolean;

  _value: T;

  _sources: ComputationNode[] | null;

  _observers: ComputationNode[] | null;

  _computed: (() => T) | null;

  _changed: (prev: T, next: T) => boolean;

  call(this: ComputationNode<T>): T;
}

type EqualityCheck<T extends unknown> = (a: T, b: T) => boolean;

type Effect = {
  (): Maybe<VoidFunction>;
};

type Func<T> = () => T;

interface Dispose {
  (): void;
}

interface Disposable extends Callable {}

interface Scope {
  [SCOPE]: Scope | null;

  _state: number;

  _compute: unknown;

  _prevSibling: Scope | null;

  _nextSibling: Scope | null;

  _context: ContextRecord | null;

  _cleanups: Disposable | Disposable[] | null;

  append(scope: Scope): void;
}

type Setter<T> = (undefined extends T ? () => undefined : {}) &
  (<U extends T>(value: (prev: T) => U) => U) &
  (<U extends T>(value: Exclude<U, Function>) => U) &
  (<U extends T>(value: Exclude<U, Function> | ((prev: T) => U)) => U);

type SignalList<T> = Array<SignalState<T>>;

type SignalState<T> = ComputationNode<T>;

type SignalOptions<T> = {
  name: string;
  equals: EqualityCheck<T>;
};

type SignalMemoOptions<T, R> = {
  initial?: R;
};

type SignalValue<T> = (T extends Function ? Func<T> : T) | undefined;

type Signal<T> = Func<T> | [Func<T>, (v: any) => void];

type Maybe<T> = T | void | null | undefined | false;
type MaybeDisposable = Maybe<Disposable>;

export {
  Effect,
  Callable,
  ComputationNode,
  Dispose,
  Disposable,
  EqualityCheck,
  Func,
  MaybeDisposable,
  Scope,
  SignalList,
  SignalOptions,
  SignalMemoOptions,
  SignalValue,
  Signal,
  Setter,
};
