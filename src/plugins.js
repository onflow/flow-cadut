/*
 * Flow Template Utilities
 *
 * Copyright 2021 Dapper Labs, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { config } from "@onflow/fcl";

export const PLUGIN_TYPES = {
  ARGUMENT: "argument",
};

export const registerPlugin = async (plugin) => {
  const { type } = plugin;
  const registeredPlugins = await config().get("ix.plugins");
  const plugins = registeredPlugins || {};
  const typedPlugins = plugins[type] || [];

  await config().put("ix.plugins", {
    ...plugins,
    [type]: [...typedPlugins, plugin],
  });
};

export const getPlugins = async (type) => {
  const registeredPlugins = await config().get("ix.plugins");
  const plugins = registeredPlugins || {};
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
