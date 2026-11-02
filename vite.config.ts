import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://skillbox.cc",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  css: {
    devSourcemap: true,
  },
});
