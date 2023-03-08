import { defineConfig } from "vite";
import plugin from "@lnl/plugin";
import alias from "@rollup/plugin-alias";
import { resolve } from "path";

const projectRootDir = resolve(__dirname);

export default defineConfig({
  resolve: {
    alias: {
      "@lnl/framework": "/Users/patsalvatore/eat_n_educate/no-name/packages/framework/dist/"
    }
  },
  plugins: [
    plugin()
    // alias({
    //   entries: [
    //     {
    //       find: "@lnl/framework",
    //       replacement: resolve("/Users/patrick/p/no-name/packages/famework/dist/index")
    //     }
    //   ]
    // })
  ]
});
