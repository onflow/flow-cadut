import { config } from "@onflow/fcl";

export const PLUGIN_TYPES = {
  ARGUMENT: "argument",
};

export const registerPlugin = async (plugin) => {
  const { type } = plugin;
  const plugins = (await config().get("ix.plugins")) || {};
  const typedPlugins = plugins[type] || [];

  await config().put("ix.plugins", {
    ...plugins,
    [type]: [...typedPlugins, plugin],
  });
};

export const getPlugins = async (type) => {
  const plugins = (await config().get("ix.plugins")) || {};
  const byType = plugins[type];

  if (byType && byType.length > 0) {
    return byType;
  }
  return false;
};

export const applyPlugins = async (props, plugins) => {
  let type = props.type;
  let value = props.value;

  for (let i = 0; i < plugins.length; i++) {
    const { resolver } = plugins[i];
    const result = await resolver(type, value);
    type = result.type;
    value = result.value;
  }

  return { type, value };
};
