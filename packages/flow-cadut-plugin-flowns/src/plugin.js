import {resolveFlownsName, isFlownsName} from "./utils"
import {TypeUtils} from "@onflow/flow-cadut"
import {PLUGIN_TYPES} from "@onflow/flow-cadut"

const resolver = async (type, value) => {
  if (!TypeUtils.isAddress(type) || !isFlownsName(value)) {
    return {type, value}
  }
  const resolved = await resolveFlownsName(value)
  return {type, value: resolved}
}

export default {
  id: "cadut-flowns-resolver",
  type: PLUGIN_TYPES.ARGUMENT,
  resolver,
}
