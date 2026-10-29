
import { defineConfig } from "vite";

const apiTarget = process.env.DOCKER === "true"
  ? "http://backend:3000"
  : "http://localhost:3000";

const proxy = {
  "/api": {
    target: apiTarget,
    changeOrigin: true,
  },
  "/health": {
    target: apiTarget,
    changeOrigin: true,
  },
};

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    proxy,
  },
  preview: {
    host: "0.0.0.0",
    port: 4173,
    strictPort: true,
    proxy,
  },
});
