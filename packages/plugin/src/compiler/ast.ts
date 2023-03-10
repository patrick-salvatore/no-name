import ts from "typescript";
import { JSXElementNode, JSXRootNode, isJSXElementNode } from "./transformer";

const AST = Symbol("AST");

export type AST = {
  [AST]: true;
  root: JSXRootNode;
  tree: any[];
};

function buildAST(root: any) {
  const ast = { [AST]: true, root, tree: [] } as AST;

  parseElement(root, ast);

  return ast;
}

function getElementTag(node: ts.JsxElement | ts.JsxSelfClosingElement) {
  return ts.isJsxElement(node)
    ? ((node.openingElement.tagName as ts.Identifier).escapedText as string)
    : ((node.tagName as ts.Identifier).escapedText as string);
}
function parseElement(root: JSXElementNode, ast: AST) {
  const tag = getElementTag(root);

  console.log(tag);
}

export { buildAST };
