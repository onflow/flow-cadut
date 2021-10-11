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

    const dict = { 0: 1, 1: 1 };
    const key = 1;
    const data = [dict, key];

    const args = () => mapValuesToCode(cadence, data);
    const result = await query({ cadence, args });
    expect(result).toBe(dict[key])
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
    expect(result.name).toBe(meta[0].name)
    expect(result.powerLevel).toBe(meta[0].powerLevel)
  });

  test("dictionary of array", async () => {
    const cadence = `
      pub fun main(data: {String: [UInt64]}): {String: [UInt64]} {
        return data
      }
    `;

    const data = {
      Starly: [1, 3, 3, 7],
      TopShot: [42],
    };

    const args = () => mapValuesToCode(cadence, [data]);

    const result = await query({ cadence, args });
    expect(result.Starly.length).toBe(data.Starly.length)
    expect(result.TopShot.length).toBe(data.TopShot.length)
  });

  test("dictionary of dictionaries of arrays", async () => {
    const cadence = `
      pub fun main(data: {Address: {String: [UInt64]}}): {Address: {String: [UInt64]}}  {
        return data
      }
    `;

    const user = "0x0000000000000001"
    const data = {
      [user]: {
        Starly: [1, 3, 3, 7],
        TopShot: [42],
      },
    };

    const args = () => mapValuesToCode(cadence, [data]);

    const result = await query({ cadence, args });
    expect(result[user].Starly.length).toBe(data[user].Starly.length)
    expect(result[user].TopShot.length).toBe(data[user].TopShot.length)
  });
});
