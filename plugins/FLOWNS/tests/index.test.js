import { setEnvironment, registerPlugin, mapValuesToCode } from "../../../src";
import { FLOWNS, contractHolder } from "../src";

describe("FLOWNS plugin", () => {
  beforeAll(async () => {
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
    const [output] = await mapValuesToCode(code, args);
    // const deployed = contractHolder["testnet"];
    // TODO: Confirm that address has been changed
    const deployed = "0x3c09a556ecca42dc";
    expect(output.value).toBe(deployed);
  });

  it("shall resolve flowns.fns properly", async () => {
    const code = `
      pub fun main(address: Address?): Address? {
        return address
      }
    `;
    const args = ["flowns.fns"];
    const [output] = await mapValuesToCode(code, args);
    const deployed = contractHolder["testnet"];
    expect(output.value).toBe(deployed);
  });

  it("shall return null for incorrect address", async () => {
    const code = `
      pub fun main(address: Address?): Address? {
        return address
      }
    `;
    const args = ["zzz.fnz"];
    const [output] = await mapValuesToCode(code, args);
    expect(output.value).toBe(null);
  });
});
