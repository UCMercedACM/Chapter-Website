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
  ]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      tseslint.configs.base,

      // React-specific configurations
      reactHooks.configs.flat.recommended,

      oxlint.configs["flat/recommended"],
    ],
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
