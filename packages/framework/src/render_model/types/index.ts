type Child = null | undefined | boolean | bigint | number | string | symbol | Node | Array<Child> | (() => Child);

type Callback = () => void;

type ComponentFunction<P = {}> = (props: P) => Child;

type ComponentIntrinsicElement = keyof JSX.IntrinsicElements;

type ComponentNode = Node;

type Component<P = {}> = ComponentFunction<P> | ComponentIntrinsicElement | ComponentNode;

type FunctionMaybe<T = unknown> = (() => T) | T;

type Func<A extends unknown[], R extends unknown = void> = (...args: A) => R;

type FragmentUndefined = { values: undefined; fragmented?: false; length: 0 };

type FragmentNode = { values: Node; fragmented?: false; length: 1 };

type FragmentFragment = { values: Fragment; fragmented: true; length: 1 };

type FragmentNodes = { values: Node[]; fragmented?: false; length: 2 | 3 | 4 | 5 };

type FragmentFragments = { values: Fragment[]; fragmented: true; length: 2 | 3 | 4 | 5 };

type FragmentMixed = { values: (Node | Fragment)[]; fragmented: true; length: 2 | 3 | 4 | 5 };

type Fragment = FragmentUndefined | FragmentNode | FragmentFragment | FragmentNodes | FragmentFragments | FragmentMixed;
type Props = Record<string, any>;

type Truthy<T = unknown> = Exclude<T, 0 | -0 | 0n | -0n | "" | false | null | undefined | void>;

export type {
  Callback,
  Child,
  Component,
  ComponentFunction,
  ComponentIntrinsicElement,
  FragmentUndefined,
  FragmentNode,
  FragmentFragment,
  FragmentNodes,
  FragmentFragments,
  FragmentMixed,
  Fragment,
  FunctionMaybe,
  Func,
  Props,
  Truthy,
};
