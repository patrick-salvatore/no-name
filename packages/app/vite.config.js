import { defineConfig } from "vite";

import plugin, { compVdomJsxPlugin } from "@lnl/plugin";

export default defineConfig({
  resolve: {
    alias: {}
  },
  plugins: [process.env.RUNTIME === "vdom" ? compVdomJsxPlugin() : plugin()]
});
