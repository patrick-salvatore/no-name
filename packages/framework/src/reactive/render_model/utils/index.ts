import type { Truthy } from "$/reactive/render_model/types";

const { assign } = Object;

const { isArray } = Array;

const isFunction = (value: unknown): value is (...args: any[]) => any => {
  return typeof value === "function";
};

const isNil = (value: unknown): value is null | undefined => {
  return value === null || value === undefined;
};

const isNode = (value: unknown): value is Node => {
  return value instanceof Node;
};

const isString = (value: unknown): value is string => {
  return typeof value === "string";
};

const isTruthy = <T>(value: T): value is Truthy<T> => {
  return !!value;
};

const isVoidChild = (
  value: unknown
): value is null | undefined | symbol | boolean => {
  return (
    value === null ||
    value === undefined ||
    typeof value === "boolean" ||
    typeof value === "symbol"
  );
};

export {
  assign,
  isArray,
  isFunction,
  isNil,
  isNode,
  isString,
  isTruthy,
  isVoidChild,
};
