import type { Plugin } from "vite";

function runtimeJsxPlugin(): Plugin {
  return {
    name: "jsx",
    enforce: "pre",
    config: () => {
      return {
        esbuild: {
          jsxInject: `import {createElement as $$jsx, Fragment as $$frag} from '@lnl/framework/reactive';\n`,
          jsxFactory: "$$jsx",
          jsxFragment: "$$frag",
        },
      };
    },
  };
}

import { createFilter, type FilterPattern } from "@rollup/pluginutils";
import transformer from "./compiler/transformer";
function compVdomJsxPlugin(): Plugin {
  const include = /\.(j|t)sx/,
    exclude = /[\\/]node_modules[\\/]/;
  const filter = createFilter(include, exclude);

  return {
    name: "jsx",
    enforce: "pre",
    transform(code, id) {
      if (!filter(id)) return null;
      transformer(code, id);

      return { code, map: null };
    },
  };
}

export { compVdomJsxPlugin, runtimeJsxPlugin };
export default runtimeJsxPlugin;
