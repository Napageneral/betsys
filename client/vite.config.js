import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import {CLIENT_PORT} from "../../shared/constants";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@client": fileURLToPath(new URL("./src", import.meta.url)),
      "@shared": fileURLToPath(new URL("../shared", import.meta.url)),
    },
    extensions: ['.tsx', '.ts', '.js', '.jsx', '.css', '.scss', '.sass', '.vue']
  },
  test: {
    coverage: {
      reporter: ['text', 'lcov']
    }
  },
  server: {
    port: CLIENT_PORT,
    strictPort: true
  },
  build: {
    minify: false
  }
});
