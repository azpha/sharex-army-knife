import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
      },
      "^/s(/|$)": {
        target: "http://localhost:3000",
        rewrite: (path) => path,
      },
      "^/l(/|$)": { target: "http://localhost:3000" },
      "^/t(/|$)": { target: "http://localhost:3000" },
      "^/f(/|$)": { target: "http://localhost:3000" },
    },
  },
});
