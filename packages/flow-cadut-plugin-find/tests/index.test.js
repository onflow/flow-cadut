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
    const [result] = await mapValuesToCode(code, args)
    expect(result.value).toBe("0x8bf9ecc3a2b8d7af")
  })

  it("shall resolve name.find properly", async () => {
    const code = `
      pub fun main(address: Address): Address {
        return address
      }
    `
    const args = ["bman.find"]
    const [result] = await mapValuesToCode(code, args)
    expect(result.value).toBe("0x8bf9ecc3a2b8d7af")
  })
})
