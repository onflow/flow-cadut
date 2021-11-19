import { setEnvironment, registerPlugin, mapValuesToCode } from "../../../src";
import { FLOWNS } from "../src/index";

describe("FLOWNS plugin", () => {
  beforeEach(async () => {
    await setEnvironment("testnet");
    await registerPlugin(FLOWNS);
  });

  it("shall resolve flowns.fn properly", async () => {
    const code = `
      pub fun main(address: Address?): Address? {
        return address
      }
    `;
    const args = ["flowns.fn"];
    return mapValuesToCode(code, args);
  });

  it("shall resolve flowns.fns properly", async () => {
    const code = `
      pub fun main(address: Address?): Address? {
        return address
      }
    `;
    const args = ["flowns.fns"];
    return mapValuesToCode(code, args);
  });

});
