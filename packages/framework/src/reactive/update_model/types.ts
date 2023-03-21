import type { SCOPE } from "./system";

type Callable<This = unknown, Return = void> = {
  call($this: This): Return;
};

type ContextRecord = Record<string | symbol, unknown>;

type ComputationNode<T = any> = {
  _name?: string | undefined;

  _effect: boolean;

  _init: boolean;

  _value: T;

  _sources: ComputationNode[] | null;

  _observers: ComputationNode[] | null;

  _computed: (() => T) | null;

  _changed: (prev: T, next: T) => boolean;

  call(this: ComputationNode<T>): T;
} & Scope;

type Dispose = {
  (): void;
};

type Disposable = {} & Callable;

type EqualityCheck<T extends unknown> = (a: T, b: T) => boolean;

type Effect = {
  (): Maybe<VoidFunction>;
};

type Func<T> = () => T;

type GraphRecord = {
  [k: string]: GraphRecord | unknown;
}

type ReadSignal<T> = {
  (): T;

  node?: ComputationNode;
};

type WriteSignal<T> = {
  node?: ComputationNode;
  set: (value: T | NextValue<T>) => T;
} & ReadSignal<T>;

type NextValue<T> = {
  (prevValue: T): T;
};

type SourceMapValue = {
  value: unknown;
  graph?: Owner;
};

type Owner = {
  owned: ComputationNode<any>[] | null;
  cleanups: (() => void)[] | null;
  owner: Owner | null;
  context: any | null;
  sourceMap?: Record<string, ComputationNode>;
  name?: string;
  componentName?: string;
};

type Scope = {
  [SCOPE]: Scope | null;

  _state: number;

  _compute: unknown;

  _prevSibling: Scope | null;

  _nextSibling: Scope | null;

  _context: ContextRecord | null;

  _cleanups: Disposable | Disposable[] | null;

  append(scope: Scope): void;
};

type Setter<T> = (undefined extends T ? () => undefined : {}) &
  (<U extends T>(value: (prev: T) => U) => U) &
  (<U extends T>(value: Exclude<U, Function>) => U) &
  (<U extends T>(value: Exclude<U, Function> | ((prev: T) => U)) => U);

type SignalList<T> = Array<SignalState<T>>;

type SignalState<T> = ComputationNode<T>;

type SignalOptions<T> = {
  name?: string;
  change?: EqualityCheck<T>;
};

type SignalMemoOptions<T, R> = {
  name?: string;
  initial?: R;
  change?: EqualityCheck<T>;
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
  GraphRecord,
  Maybe,
  MaybeDisposable,
  Owner,
  ReadSignal,
  Scope,
  SignalList,
  SignalOptions,
  SignalMemoOptions,
  SignalValue,
  Signal,
  SourceMapValue,
  Setter,
  WriteSignal,
  NextValue,
};
