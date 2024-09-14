import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        popup: "./src/popup/index.html",
      },
      output: {
        entryFileNames: "[name].js",
      },
    },
  },
});
