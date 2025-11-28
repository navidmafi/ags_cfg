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
    // https://docs.gtk.org/gtk4/css-properties.html
    backgroundColor: true,
    textColor: true,
    fontSize: true,
    borderColor: true,
    borderStyle: true,
    borderOpacity: true,
    borderWidth: true,
    borderRadius: true,
    opacity: true,
    padding: true,
    margin: true,
    // No support for width/height or max-width/max-height
    // But min-width & min-height are supported
    minHeight: true,
    minWidth: true,
    outlineColor: true,
    outlineStyle: true,
    outlineWidth: true,
    boxShadow: true,
    dropShadow: true,
    backgroundImage: true,
    boxShadowColor: true,
    transitionDelay: true,
    transitionDuration: true,
    transitionTimingFunction: true,
    transitionProperty: true,
    animation: true,
    fontWeight: true,
    fontFamily: true,
    filter: true,
    brightness: true,
  },
};

export default config;
