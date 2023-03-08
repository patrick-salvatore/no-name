import { transformAsync } from "@babel/core";
import type { Plugin } from "vite";

function jsxPlugin(): Plugin {
  return {
    name: "jsx",
    enforce: "pre",
    config: () => {
      return {
        esbuild: {
          jsxInject: `import {createElement as $$jsx, Fragment as $$frag} from '@lnl/framework';\n`,
          jsxFactory: "$$jsx",
          jsxFragment: "$$frag",
        },
      };
    },
    // async transform(source, id) {
    //   if (id.includes("node_modules") || !/\.jsx|tsx$/.test(id)) return;

    //   const file = await transformAsync(source, {
    //     // plugins: [["@babel/plugin-syntax-jsx", { pragma: "$jsx" }]],
    //     plugins: [
    //       [
    //         "babel-plugin-transform-rename-import",
    //         {
    //           original: "framework",
    //           replacement: "@lnl/framework",
    //         },
    //       ],
    //     ],
    //   });
    //   if (!file) throw Error;

    //   const { code, map } = file;

    //   const wrappedCode = `
    //     ${code}
    //   `;

    //   return {
    //     code: wrappedCode,
    //     map: map,
    //   };
    // },
  };
}

export default jsxPlugin;
