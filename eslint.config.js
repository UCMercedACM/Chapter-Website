import pluginQuery from "@tanstack/eslint-plugin-query";
import pluginRouter from "@tanstack/eslint-plugin-router";
import eslintPluginBetterTailwindcss from "eslint-plugin-better-tailwindcss";
import oxlint from "eslint-plugin-oxlint";
import perfectionist from "eslint-plugin-perfectionist";
import reactDom from "eslint-plugin-react-dom";
import reactJsx from "eslint-plugin-react-jsx";
import reactX from "eslint-plugin-react-x";
import sonarjs from "eslint-plugin-sonarjs";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores([
    "node_modules",
    "dist",

    // Automatically generated code
    "src/routeTree.gen.ts",
    "src/types/kanae.gen.ts",
    "src/hooks/use-mobile.ts",

    // Shadcn/ui components
    "src/components/ui",
    "!src/components/ui/theme-provider.tsx",
    "!src/components/ui/carousel.tsx",
    "!src/components/ui/data-table.tsx",
    "!src/components/ui/date-picker.tsx",
  ]),

  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      tseslint.configs.base,

      // React-specific configurations
      eslintPluginBetterTailwindcss.configs.recommended,

      // General linter rules
      sonarjs.configs.recommended,

      // Tanstack-specific rules
      pluginRouter.configs["flat/recommended"],
      pluginQuery.configs["flat/recommended-strict"],

      oxlint.configs["flat/recommended"],
    ],
    plugins: {
      perfectionist,
      "react-dom": reactDom,
      "react-jsx": reactJsx,
      "react-x": reactX,
    },
    rules: {
      // React-specific rules
      "react-dom/no-use-form-state": "error",
      "react-jsx/no-leaked-dollar": "error",
      "react-jsx/no-leaked-semicolon": "error",
      "react-x/no-context-provider": "error",
      "react-x/no-create-ref": "error",
      "react-x/no-forward-ref": "error",
      "react-x/no-use-context": "error",
      "sonarjs/cognitive-complexity": "off",

      // Perfectionist
      "perfectionist/sort-array-includes": "error",
      "perfectionist/sort-classes": "error",
      "perfectionist/sort-decorators": "error",
      "perfectionist/sort-enums": "error",
      "perfectionist/sort-export-attributes": "error",
      "perfectionist/sort-heritage-clauses": "error",
      "perfectionist/sort-import-attributes": "error",
      "perfectionist/sort-intersection-types": "error",
      "perfectionist/sort-maps": "error",
      "perfectionist/sort-object-types": "error",
      "perfectionist/sort-sets": "error",
      "perfectionist/sort-switch-case": "error",
      "perfectionist/sort-variable-declarations": "error",

      // TailwindCSS - Oxfmt handles these already
      "better-tailwindcss/enforce-consistent-class-order": "off",
      "better-tailwindcss/enforce-consistent-line-wrapping": "off",
      "better-tailwindcss/no-unnecessary-whitespace": "off",
    },
    settings: {
      "better-tailwindcss": {
        entryPoint: "src/index.css",
      },
      perfectionist: { type: "natural", order: "asc" },
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        parser: tseslint.parser,
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
]);
