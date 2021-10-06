import path from "path";
import { query, mutate } from "../../src";
import { emulator, init } from "flow-js-testing";
import { authorization } from "../utils";
import { config } from "@onflow/fcl";

// Increase timeout if your tests failing due to timeout
jest.setTimeout(10000);

describe("arguments - scripts", () => {
  beforeAll(async () => {
    const basePath = path.resolve(__dirname, "../cadence");
    // You can specify different port to parallelize execution of describe blocks
    const port = 8080;
    // Setting logging flag to true will pipe emulator output to console
    const logging = false;

    await init(basePath, { port, logging });
    return emulator.start(port);
  });

  // Stop emulator, so it could be restarted
  afterAll(async () => {
    return emulator.stop();
  });

  test("raw query output", async () => {
    const cadence = `
      pub struct Info{
        pub let message: String
        init(){
          self.message = "hello"
        }
      }
      pub fun main(): Info {
        return Info()
      }
    `;

    const [result] = await query({ cadence, raw: true });

    expect(result.type).toBe("Struct");
    expect(result.value.id.includes("Info")).toBe(true);
    expect(result.value.fields[0].name).toBe("message");
    expect(result.value.fields[0].value.type).toBe("String");
    expect(result.value.fields[0].value.value).toBe("hello");
  });

  it("shall work for transaction - once executed", async () => {
    const cadence = `
      transaction{
        prepare(singer: AuthAccount){
          log("all cool")
        }
      }
    `;
    const payer = authorization();
    const [txId, err] = await mutate({ cadence, payer, wait: null });
    console.log({ txId, err });
  });
});
