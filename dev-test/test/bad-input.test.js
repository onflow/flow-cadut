import path from "path";
import { emulator, init } from "flow-js-testing";
import { executeScript, mutate } from "../../src";
import { authorization } from "../utils";

// Increase timeout if your tests failing due to timeout
jest.setTimeout(10000);

describe("optional arguments", () => {
  beforeEach(async () => {
    const basePath = path.resolve(__dirname, "../cadence");
    // You can specify different port to parallelize execution of describe blocks
    const port = 8080;
    // Setting logging flag to true will pipe emulator output to console
    const logging = false;

    await init(basePath, { port });
    return emulator.start(port, logging);
  });

  // Stop emulator, so it could be restarted
  afterEach(async () => {
    return emulator.stop();
  });

  it("shall throw - from faulty script", async () => {
    const executionResult = await executeScript({
      code: `
        pub fun main(): Int{
          return "bazinga"
        }
      `,
    });
    const [result, err] = executionResult;
    expect(result).toBe(null)
    expect(err).not.toBe(null)
  });

  it("shall throw - transaction", async ()=>{
    const cadence = `
      transaction{
        prepare(singer: AuthAccount){
          log("all cool")
        }
      }
    `;
    const payer = (()=>{})();
    const [txResult, err] = await mutate({ cadence, payer });
    expect(txResult).toBe(null)
    expect(err).not.toBe(null)
  })
});
