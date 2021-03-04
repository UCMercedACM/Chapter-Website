import { setCompodocJson } from "@storybook/addon-docs/angular";
import "@storybook/addon-actions/register";

import docJson from "../documentation.json";

setCompodocJson(docJson);

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
};
