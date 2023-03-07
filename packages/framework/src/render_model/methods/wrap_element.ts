/* IMPORT */
import { ELEMENT_SYMBOL } from "~/render_model/constants";

/* MAIN */

const wrapElement = <T extends Function>(element: T): T => {
  element[ELEMENT_SYMBOL] = true;
  return element;
};

/* EXPORT */

export default wrapElement;
