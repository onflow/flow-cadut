import path from "path";
import { query } from "@onflow/fcl";
import { emulator, init } from "flow-js-testing";
import { mapValuesToCode } from "../../src";

// Increase timeout if your tests failing due to timeout
jest.setTimeout(10000);

describe("multi-line", () => {
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

  test("single line arguments - script", async () => {
    const cadence = `
      pub fun main(a: UInt64,b: UInt64): UInt64 {
        return a + b
      }
    `;
    const a = 13;
    const b = 37;
    const result = await query({
      cadence,
      args: () => mapValuesToCode(cadence, [a, b]),
    });
    expect(result).toBe(a + b);
  });

  test("single line arguments - script - trailing comma", async () => {
    const cadence = `
      pub fun main(a: UInt64,b: UInt64,): UInt64 {
        return a + b
      }
    `;
    const a = 13;
    const b = 37;
    const result = await query({
      cadence,
      args: () => mapValuesToCode(cadence, [a, b]),
    });
    expect(result).toBe(a + b);
  });

  test("multi line arguments - script", async () => {
    const cadence = `
      pub fun main(
        a: UInt64,
        b: UInt64
      ): UInt64 {
        return a + b
      }
    `;
    const a = 13;
    const b = 37;
    const result = await query({
      cadence,
      args: () => mapValuesToCode(cadence, [a, b]),
    });
    expect(result).toBe(a + b);
  });

  test("multi line arguments - script - trailing comma", async () => {
    const cadence = `
      pub fun main(
        a: UInt64,
        b: UInt64,
      ): UInt64 {
        return a + b
      }
    `;
    const a = 13;
    const b = 37;
    const result = await query({
      cadence,
      args: () => mapValuesToCode(cadence, [a, b]),
    });
    expect(result).toBe(a + b);
  });
});
