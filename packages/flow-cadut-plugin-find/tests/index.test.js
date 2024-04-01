import {
  setEnvironment,
  registerPlugin,
  mapValuesToCode,
} from "@onflow/flow-cadut"
import {FIND} from "../src/index"

describe("FIND plugin", () => {
  beforeEach(async () => {
    await setEnvironment("mainnet")
    await registerPlugin(FIND)
  })

  it("shall resolve find:name properly", async () => {
    const code = `
      pub fun main(address: Address): Address {
        return address
      }
    `

    // test relies on this address to be registered
    // if it breaks, swap it with another address
    const args = ["find:roham"]
    const [result] = await mapValuesToCode(code, args)
    expect(result.value).toBe("0x65f12353ccc255ee")
  })

  it("shall resolve name.find properly", async () => {
    const code = `
      pub fun main(address: Address): Address {
        return address
      }
    `

    // test relies on this address to be registered
    // if it breaks, swap it with another address
    const args = ["roham.find"]
    const [result] = await mapValuesToCode(code, args)
    expect(result.value).toBe("0x65f12353ccc255ee")
  })
})
