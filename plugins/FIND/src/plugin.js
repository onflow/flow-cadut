import { findAddress, isFindAddress } from "./utils";
import { isAddress } from "../../../src/type-checker";
import { PLUGIN_TYPES } from "../../../src";

const resolver = async (type, value) => {
  if (!isAddress(type) || !isFindAddress(value)) {
    return { type, value };
  }
  const resolved = await findAddress(value);
  return { type, value: resolved };
};

export default {
  id: "cadut-find-resolver",
  type: PLUGIN_TYPES.ARGUMENT,
  resolver,
};
