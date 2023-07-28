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
    const args = ["find:shiny"]
    const mapped = mapValuesToCode(code, args)
    expect(mapped).toBe(true)
  })

  it("shall resolve name.find properly", async () => {
    const code = `
      pub fun main(address: Address): Address {
        return address
      }
    `
    const args = ["shiny.find"]
    const mapped = mapValuesToCode(code, args)
    expect(mapped).toBe(true)
  })
})
