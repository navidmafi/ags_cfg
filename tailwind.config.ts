import resolveConfig from "tailwindcss/resolveConfig";
import defaultConfig from "tailwindcss/defaultConfig";
import type { Config } from "tailwindcss";

import theme from "./theme.json";
import { CorePluginList } from "tailwindcss/types/generated/corePluginList";

const resolvedConfig = resolveConfig(defaultConfig);

const corePluginsDisabled = Object.fromEntries(
  resolvedConfig.corePlugins.map((k: CorePluginList) => [k, false])
);

const config: Config = {
  content: ["./widget/**/*.tsx", "./common/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        ...theme.colors.dark,
      },
    },
  },
  plugins: [],
  corePlugins: {
    ...corePluginsDisabled,
    backgroundColor: true,
    textColor: true,
    fontSize: true,
    borderColor: true,
    borderWidth: true,
    borderRadius: true,
    opacity: true,
    padding: true,
    margin: true,
    minHeight: true,
    minWidth: true,
    outlineColor: true,
    outlineStyle: true,
    outlineWidth: true,
  },
};

export default config;
