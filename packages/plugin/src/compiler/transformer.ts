import ts from "typescript";

import { buildAST } from "./ast";

const tsxRE = /\.tsx/;

function transformer(code: string, filename: string) {
  const source = ts.createSourceFile(
    filename,
    code,
    99,
    true,
    tsxRE.test(filename) ? 4 : 2
  );

  const ast: any = [];
  const parse = (node: ts.Node) => {
    if (isJSXElementNode(node)) {
      ast.push(buildAST(node));
      return;
    }

    ts.forEachChild(node, parse);
  };

  ts.forEachChild(source, parse);

  console.log(ast);

  return {
    startPos: 0,
    ast: [],
  };
}

export type JSXElementNode = ts.JsxElement | ts.JsxSelfClosingElement;

export type JSXRootNode =
  | JSXElementNode
  | ts.JsxFragment
  | ts.BinaryExpression
  | ts.ConditionalExpression;

export function isJSXElementNode(node: ts.Node): node is JSXElementNode {
  return ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node);
}

export default transformer;
