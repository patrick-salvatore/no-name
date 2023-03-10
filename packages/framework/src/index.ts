let lib;
if (process.env.RUNTIME === "reactive") {
  lib = require("./reactive");
} else {
  lib = require("./vdom");
}

export default lib;
