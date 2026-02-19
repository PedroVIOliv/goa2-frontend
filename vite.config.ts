import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      localsConvention: "camelCaseOnly",
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/games": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
      "/heroes": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});
