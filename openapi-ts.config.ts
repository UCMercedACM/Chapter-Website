import { defineConfig, type UserConfig } from "@hey-api/openapi-ts";

// defineConfig requires us to have the input field. We don't use it
// so we'll get rid of it
const config: Omit<UserConfig, "input"> = {
  output: {
    path: "src/types",
    clean: false,
    entryFile: false,
    fileName: { name: "kanae" },
    postProcess: [
      { name: "oxfmt", command: "oxfmt", args: ["--write", "{{path}}/kanae.gen.ts"] }
    ]
  },
  plugins: ["@hey-api/typescript"]
};

export default defineConfig(config as UserConfig);
