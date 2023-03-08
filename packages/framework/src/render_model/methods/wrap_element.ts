import { ELEMENT_SYMBOL } from "~/render_model/constants";

const wrapElement = <T extends Function>(element: T): T => {
  element[ELEMENT_SYMBOL] = true;
  return element;
};

export default wrapElement;
