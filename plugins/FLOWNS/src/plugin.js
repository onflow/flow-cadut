import { resolveFlownsName, isFlownsName } from "./utils";
import { isAddress } from "../../../src/type-checker";
import { PLUGIN_TYPES } from "../../../src";

const resolver = async (type, value) => {
  if (!isAddress(type) || !isFlownsName(value)) {
    return { type, value };
  }
  const resolved = await resolveFlownsName(value);
  return { type, value: resolved };
};

export default {
  id: "cadut-flowns-resolver",
  type: PLUGIN_TYPES.ARGUMENT,
  resolver,
};
