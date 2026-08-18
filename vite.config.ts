import path from "node:path";

import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

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
    VitePWA({
      registerType: "autoUpdate",
      manifestFilename: "site.webmanifest",
      manifest: {
        id: "/",
        name: "ACM @ UC Merced",
        short_name: "UCMACM",
        description:
          "The official website of the Association for Computing Machinery student chapter at UC Merced — find our events, student projects, and special interest groups.",
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#F5F5F5",
        theme_color: "#00E1BF",
        icons: [
          { src: "/pwa-192x192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "/pwa-512x512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          {
            src: "/pwa-maskable-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "/pwa-maskable-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,woff2}"],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  build: {
    rolldownOptions: {
      // Until Oxc has their Rust-port of the React Compiler stabilized, just
      // silence the plugin timings for now
      checks: { pluginTimings: false },
      output: {
        codeSplitting: {
          groups: [
            // Schedule-X's renderer uses @preact/signals, so we send it into its own vendor chunk
            { name: "vendor-preact", test: /[\\/](preact|@preact)[\\/]/ },
            { name: "vendor-react", test: /[\\/]node_modules[\\/]react(-dom)?[\\/]/ },
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
