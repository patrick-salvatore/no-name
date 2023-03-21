import { STYLE_LIST_SYMBOL } from "../constants";

function styleList(styles: () => string[] | Record<string, boolean>) {
  styles[STYLE_LIST_SYMBOL] = true;

  return styles;
}

export { styleList };
