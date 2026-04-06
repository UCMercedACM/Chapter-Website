import path from "node:path";

import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react, {reactCompilerPreset} from "@vitejs/plugin-react";
import babel from '@rolldown/plugin-babel'
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
    babel({
      presets: [reactCompilerPreset()]
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: "vendor-react", test: /[\\/]react(-dom)?[\\/]/ },
            { name: "vendor-base-ui", test: /[\\/]@base-ui[\\/]/ },
            { name: "vendor-tanstack", test: /[\\/]@tanstack[\\/]/ },
            { name: "vendor-misc", test: /node_modules[\\/]/ },
          ],
        },
      },
    },
  },
});
