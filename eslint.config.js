import eslintPluginBetterTailwindcss from "eslint-plugin-better-tailwindcss";
import oxlint from "eslint-plugin-oxlint";
import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores([
    "node_modules",
    "dist",

    // Automatically generated code
    "src/routeTree.gen.ts",

    // Shadcn/ui components
    "src/components/ui",
    "!src/components/ui/theme-provider.tsx",
    "!src/components/ui/carousel.tsx",
  ]),

  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      tseslint.configs.base,

      // React-specific configurations
      reactHooks.configs.flat.recommended,
      eslintPluginBetterTailwindcss.configs.recommended,

      oxlint.configs["flat/recommended"],
    ],
    rules: {
      // TailwindCSS - Oxfmt handles these already
      "better-tailwindcss/enforce-consistent-class-order": "off",
      "better-tailwindcss/enforce-consistent-line-wrapping": "off",
      "better-tailwindcss/no-unnecessary-whitespace": "off",
    },
    settings: {
      "better-tailwindcss": {
        entryPoint: "src/index.css",
      },
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
]);
