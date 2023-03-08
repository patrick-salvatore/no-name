import { defineConfig } from "vite";

import plugin from "@lnl/plugin";

export default defineConfig({
  resolve: {
    alias: {}
  },
  plugins: [plugin()]
});
