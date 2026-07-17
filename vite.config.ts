import path from "node:path";

import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
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
      presets: [reactCompilerPreset()],
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
            // Schedule-X's renderer uses @preact/signals, so we send it into its own vendor chunk
            { name: "vendor-preact", test: /[\\/](preact|@preact)[\\/]/ },
            { name: "vendor-react", test: /[\\/]node_modules[\\/]react(-dom)?[\\/]/ },
            { name: "vendor-base-ui", test: /[\\/](@base-ui|@floating-ui)[\\/]/ },
            { name: "vendor-tanstack", test: /[\\/]@tanstack[\\/]/ },
            {
              name: "vendor-icons",
              test: /[\\/](@icons-pack[\\/]react-simple-icons|lucide-react)[\\/]/,
            },
            {
              name: "vendor-schedule-x",
              test: /[\\/]@schedule-x[\\/]/,
            },
            {
              name: "vendor-temporal",
              test: /[\\/]temporal-polyfill[\\/]/,
            },
            // All shared utils get used at first paint, so throw them into their own vendor chunk
            {
              name: "vendor-utils",
              test: /[\\/](zod|axios|sonner|clsx|class-variance-authority|tailwind-merge|next-themes)[\\/]/,
            },
          ],
        },
      },
    },
  },
});
