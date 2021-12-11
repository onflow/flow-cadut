import { setEnvironment, registerPlugin, mapValuesToCode } from "../../../src";
import { FIND } from "../src/index";

describe("FIND plugin", () => {
  beforeEach(async () => {
    await setEnvironment("testnet");
    await registerPlugin(FIND);
  });

  it("shall resolve find:name properly", async () => {
    const code = `
      pub fun main(address: Address): Address {
        return address
      }
    `;
    const args = ["find:shiny"];
    return mapValuesToCode(code, args);
  });

  it("shall resolve name.find properly", async () => {
    const code = `
      pub fun main(address: Address): Address {
        return address
      }
    `;
    const args = ["shiny.find"];
    return mapValuesToCode(code, args);
  });
});
