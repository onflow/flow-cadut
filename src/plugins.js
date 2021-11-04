import { config } from "@onflow/fcl";

export const registerPlugin = ({ type, id, callback }) => {
  const plugins = config.get("ix.plugins") || {};
  const typedPlugins = plugins[type] || [];
  config.set("ix.plugins", {
    ...plugins,
    [type]: [
      ...typedPlugins,
      {
        id,
        callback,
      },
    ],
  });
  console.log({ plugins });
};
