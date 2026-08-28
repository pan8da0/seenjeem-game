import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Relative base so the built site works both at the domain root and
// under a GitHub Pages project subpath (https://user.github.io/repo/).
export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    outDir: "dist",
    assetsInlineLimit: 0,
  },
});
