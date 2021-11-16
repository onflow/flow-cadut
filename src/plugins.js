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

export const getPlugins = (type) => {
  const plugins = config.get("ix.plugins") || {};
  return plugins[type] && plugins[type].length > 0;
};

export const applyPlugins = async (props, plugins) => {
  let type = props.type;
  let value = props.value;
  for (let i = 0; i < plugins.length; i++) {
    const { callback } = plugins[i];
    const result = await callback(type, value);
    type = result.type;
    value = result.value;
  }

  return { type, value };
};
