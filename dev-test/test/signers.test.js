import path from "path";
import { emulator, init } from "flow-js-testing";
import { sendTransaction, executeScript } from "../../src";

describe("signers", () => {
  beforeEach(async () => {
    const basePath = path.resolve(__dirname, "../cadence");
    // You can specify different port to parallelize execution of describe blocks
    const port = 8080;
    // Setting logging flag to true will pipe emulator output to console
    const logging = false;

    await init(basePath, { port });
    await emulator.start(port, logging);
  });

  // Stop emulator, so it could be restarted
  afterEach(async () => {
    return emulator.stop();
  });

  it("shall execute script", async ()=>{
    const [result, err] = await executeScript({
      code: `
        pub fun main(): Int{
          return 42
        }
      `
    })
    console.log({ result, err})
  })

  it("shall properly sign transaction", async () => {
    const code = `
      transaction{
        prepare(signer: AuthAccount){
          log(signer.address)
        }
      }
    `;

    const privateKey = "2594485368239971d66c1017f887e7265609d8a568cd6271b7626f5f14d0c2b4";
    const address = "0xf8d6e0586b0a20c7";
    const keyId = 0;
    const payer = {
      privateKey,
      address,
      keyId,
    };

    const [result, err] = await sendTransaction({ code, payer });
    console.log(result);
    console.log(err);
  });
});
