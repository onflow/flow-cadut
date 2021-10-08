import path from "path";
import { query } from "@onflow/fcl";
import { emulator, init } from "flow-js-testing";
import { mapValuesToCode } from "../../src";

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

  test("{UInt32: UInt32} dictionary", async () => {
    const cadence = `
    pub fun main(data: {UInt32: UInt32}, key: UInt32): UInt32?{
      return data[key]
    }
    `;

    const data = [{ 0: 1, 1: 1 }, 1];

    const args = () => mapValuesToCode(cadence, data);
    const result = await query({ cadence, args });
    console.log({ result });
  });

  test("array of dictionaries", async () => {
    const cadence = `
      pub fun main(meta: [{ String: String }]): {String: String} {
        return meta[0]
      }
    `;

    const meta = [
      {
        name: "James",
        powerLevel: "3000",
      },
      {
        name: "Hunter",
        powerLevel: "9000",
      },
    ];

    const args = () => mapValuesToCode(cadence, [meta]);

    const result = await query({ cadence, args });
    console.log({ result });
  });
});
