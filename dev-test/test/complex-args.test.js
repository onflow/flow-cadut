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

  test("[UInt32} array", async () => {
    const cadence = `
    pub fun main(data: [UInt32]): [UInt32]{
      return data
    }
    `;

    const input = [1,3,3,7]
    const values = await mapValuesToCode(cadence, [input])
    const args = () => values;
    const result = await query({ cadence, args });
    console.log({result})
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

    const values = await mapValuesToCode(cadence, data)
    const args = () => values;
    const result = await query({ cadence, args });
    expect(result).toBe(dict[key])
  });

  test("{String: UInt32} dictionary", async () => {
    const cadence = `
    pub fun main(data: {String: UInt32}, key: String): UInt32?{
      return data[key]
    }
    `;

    const dict = { cadence: 42, test: 1337 };
    const key = "test";
    const data = [dict, key];

    const values = await mapValuesToCode(cadence, data)
    const args = () => values;
    const result = await query({ cadence, args });
    expect(result).toBe(dict[key])
  });

  test("{String: String} dictionary", async () => {
    const cadence = `
    pub fun main(data: {String: String}, key: String): String?{
      return data[key]
    }
    `;

    const dict = { cadence: "rules!" };
    const key = "cadence";
    const data = [dict, key];

    const values = await mapValuesToCode(cadence, data)
    const args = () => values;
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


    const values = await mapValuesToCode(cadence, [meta])
    const args = () => values;
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

    const values = await mapValuesToCode(cadence, [data])
    const args = () => values;
    const result = await query({ cadence, args });
    expect(result.Starly.length).toBe(data.Starly.length)
    expect(result.TopShot.length).toBe(data.TopShot.length)
  });

  test("dictionary of array - Address to [UInt64]", async () => {
    const cadence = `
      pub fun main(data: {Address: [UInt64]}): {Address: [UInt64]} {
        return data
      }
    `;

    const First = "0x0000000000000001"
    const Second = "0x0000000000000002"

    const data = {
      [First]: [1, 3, 3, 7],
      [Second]: [42],
    };

    const values = await mapValuesToCode(cadence, [data])
    const args = () => values;

    const result = await query({ cadence, args });
    expect(result[First].length).toBe(data[First].length)
    expect(result[Second].length).toBe(data[Second].length)
  });

  test("dictionary of array - Address to [UInt64] and another array", async () => {
    const cadence = `
      pub fun main(recipients:[Address], data: {Address: [UInt64]}): {Address: [UInt64]} {
        log(recipients)
        return data
      }
    `;

    const First = "0x0000000000000001"
    const Second = "0x0000000000000002"

    const recipients = [First, Second]

    const data = {
      [First]: [1, 3, 3, 7],
      [Second]: [42],
    };

    const values = await mapValuesToCode(cadence, [recipients, data])
    const args = () => values;

    const result = await query({ cadence, args });
    expect(result[First].length).toBe(data[First].length)
    expect(result[Second].length).toBe(data[Second].length)
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

    const values = await mapValuesToCode(cadence, [data])
    const args = () => values;

    const result = await query({ cadence, args });
    expect(result[user].Starly.length).toBe(data[user].Starly.length)
    expect(result[user].TopShot.length).toBe(data[user].TopShot.length)
  });
});
