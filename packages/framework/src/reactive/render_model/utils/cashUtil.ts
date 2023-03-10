import type { Cash, CashNode, CashCash } from "../types";

const NOOP_CHILDREN: Node[] = [];

const CashUtils = {
  make: (): Cash => {
    return {
      values: undefined,
      length: 0,
    };
  },

  makeWithNode: (node: Node): CashNode => {
    return {
      values: node,
      length: 1,
    };
  },

  makeWithCash: (fragment: Cash = CashUtils.makeWithCash()): CashCash => {
    return {
      values: fragment,
      cashed: true,
      length: 1,
    };
  },

  getChildrenCashed: (cash: Cash, children: Node[] = []): Node[] => {
    const { values, length } = cash;

    if (!length) return children;

    if (values instanceof Array) {
      for (let i = 0, l = values.length; i < l; i++) {
        const value = values[i];

        if (value instanceof Node) {
          children.push(value);
        } else {
          CashUtils.getChildrenCashed(value, children);
        }
      }
    } else {
      if (values instanceof Node) {
        children.push(values);
      } else {
        CashUtils.getChildrenCashed(values, children);
      }
    }

    return children;
  },

  getChildren: (cash: Cash): Node | Node[] => {
    if (!cash.length) return NOOP_CHILDREN;

    if (!cash.cashed) return cash.values;

    if (cash.length === 1) return CashUtils.getChildren(cash.values);

    return CashUtils.getChildrenCashed(cash);
  },

  pushCash: (cash: Cash, fragment: Cash): void => {
    CashUtils.pushValue(cash, fragment);

    cash.cashed = true;
  },

  pushNode: (cash: Cash, node: Node): void => {
    CashUtils.pushValue(cash, node);
  },

  pushValue: (cash: Cash, value: Node | Cash): void => {
    const { values, length } = cash as any; //TSC

    if (length === 0) {
      cash.values = value;
    } else if (length === 1) {
      cash.values = [values, value];
    } else {
      values.push(value);
    }

    cash.length += 1;
  },

  replaceWithNode: (cash: Cash, node: Node): void => {
    cash.values = node;
    delete cash.cashed;
    cash.length = 1;
  },

  replaceWithCash: (cash: Cash, fragment: Cash): void => {
    cash.values = fragment.values;
    cash.cashed = fragment.cashed;
    cash.length = fragment.length;
  },
};

export default CashUtils;
