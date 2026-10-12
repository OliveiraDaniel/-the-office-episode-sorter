import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Matches the GitHub Pages project-page path:
// https://oliveiradaniel.github.io/-the-office-episode-sorter/
export default defineConfig({
  base: "/-the-office-episode-sorter/",
  plugins: [react()],
});
