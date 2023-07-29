import {
  setEnvironment,
  registerPlugin,
  mapValuesToCode,
} from "@onflow/flow-cadut"
import {FIND} from "../src/index"

describe("FIND plugin", () => {
  beforeEach(async () => {
    await setEnvironment("testnet")
    await registerPlugin(FIND)
  })

  it("shall resolve find:name properly", async () => {
    const code = `
      pub fun main(address: Address): Address {
        return address
      }
    `
    const args = ["find:bman"]
    return mapValuesToCode(code, args)
  })

  it("shall resolve name.find properly", async () => {
    const code = `
      pub fun main(address: Address): Address {
        return address
      }
    `
    const args = ["bman.find"]
    return mapValuesToCode(code, args)
  })
})
