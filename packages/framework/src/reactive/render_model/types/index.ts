type Child = null | undefined | boolean | bigint | number | string | symbol | Node | Array<Child> | (() => Child);

type Callback = () => void;

type ComponentFunction<P = {}> = (props: P) => Child;

type ComponentIntrinsicElement = keyof JSX.IntrinsicElements;

type ComponentNode = Node;

type Component<P = {}> = ComponentFunction<P> | ComponentIntrinsicElement | ComponentNode;

type FunctionMaybe<T = unknown> = (() => T) | T;

type Func<A extends unknown[], R extends unknown = void> = (...args: A) => R;

type CashUndefined = { values: undefined; cashed?: false; length: 0 };

type CashNode = { values: Node; cashed?: false; length: 1 };

type CashCash = { values: Cash; cashed: true; length: 1 };

type CashNodes = { values: Node[]; cashed?: false; length: 2 | 3 | 4 | 5 };

type CashCashs = { values: Cash[]; cashed: true; length: 2 | 3 | 4 | 5 };

type CashMixed = { values: (Node | Cash)[]; cashed: true; length: 2 | 3 | 4 | 5 };

type Cash = CashUndefined | CashNode | CashCash | CashNodes | CashCashs | CashMixed;

type Props = Record<string, any>;

type Truthy<T = unknown> = Exclude<T, 0 | -0 | 0n | -0n | "" | false | null | undefined | void>;

type Ref<T = any> = {current: T | null}

export type {
  Callback,
  Child,
  Component,
  ComponentFunction,
  ComponentIntrinsicElement,
  CashUndefined,
  CashNode,
  CashCash,
  CashNodes,
  CashCashs,
  CashMixed,
  Cash,
  FunctionMaybe,
  Func,
  Props,
  Ref,
  Truthy,
};
