import {findAddress, isFindAddress} from "./utils"
import {TypeUtils} from "@onflow/flow-cadut"
import {PLUGIN_TYPES} from "@onflow/flow-cadut"

const resolver = async (type, value) => {
  if (!TypeUtils.isAddress(type) || !isFindAddress(value)) {
    return {type, value}
  }
  const resolved = await findAddress(value)
  return {type, value: resolved}
}

export default {
  id: "cadut-find-resolver",
  type: PLUGIN_TYPES.ARGUMENT,
  resolver,
}
