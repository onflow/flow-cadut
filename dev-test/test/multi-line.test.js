import path from "path";
import { config, query } from "@onflow/fcl";
import { emulator, init } from "flow-js-testing";
import { mapValuesToCode } from "../../src";
import { mutate } from "../utils";

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

  test("single line arguments", async () => {
    const cadence = `
      pub fun main(a: UInt64,b: UInt64): UInt64 {
        return a + b
      }
    `;
    const a = 13;
    const b = 37;
    const values = await mapValuesToCode(cadence, [a, b]);
    const args = () => values;
    const result = await query({ cadence, args });
    expect(result).toBe(a + b);
  });

  test("single line arguments - trailing comma", async () => {
    const cadence = `
      pub fun main(a: UInt64,b: UInt64,): UInt64 {
        return a + b
      }
    `;
    const a = 13;
    const b = 37;
    const values = await mapValuesToCode(cadence, [a, b]);
    const args = () => values;
    const result = await query({ cadence, args });
    expect(result).toBe(a + b);
  });

  test("multi line arguments", async () => {
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
    const values = await mapValuesToCode(cadence, [a, b]);
    const args = () => values;
    const result = await query({ cadence, args });
    expect(result).toBe(a + b);
  });

  test("multi line arguments - trailing comma", async () => {
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
    const values = await mapValuesToCode(cadence, [a, b]);
    const args = () => values;
    const result = await query({ cadence, args });
    expect(result).toBe(a + b);
  });
});

// Transaction templates
const txSingleLine = `
  transaction(a: UInt64, b: UInt64, sum: UInt64){
    prepare(signer: AuthAccount){
      assert(a + b == sum, message: "wrong!")
    }
  }
`;
const txSingleLineTrailingComma = `
  transaction(a: UInt64, b: UInt64, sum: UInt64,){
    prepare(signer: AuthAccount){
      assert(a + b == sum, message: "wrong!")
    }
  }
`;
const txMultiLine = `
  transaction(
    a: UInt64, 
    b: UInt64, 
    sum: UInt64
  ){
    prepare(signer: AuthAccount){
      assert(a + b == sum, message: "wrong!")
    }
  }
`;
const txMultiLineTrailingComma = `
  transaction(
    a: UInt64, 
    b: UInt64, 
    sum: UInt64,
  ){
    prepare(signer: AuthAccount){
      assert(a + b == sum, message: "wrong!")
    }
  }
`;

describe("arguments - transactions", () => {
  beforeAll(async () => {
    await config().put(
      "PRIVATE_KEY",
      "2594485368239971d66c1017f887e7265609d8a568cd6271b7626f5f14d0c2b4"
    );
    await config().put("SERVICE_ADDRESS", "f8d6e0586b0a20c7");

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

  test("single line", async () => {
    const cadence = txSingleLine;
    const a = 1;
    const b = 2;
    const sum = a + b;

    const args = [a, b, sum];
    const { status, errorMessage } = await mutate({ cadence, args });

    expect(status).toBe(4);
    expect(errorMessage).toBe("");
  });

  test("single line - trailing comma", async () => {
    const cadence = txSingleLineTrailingComma;
    const a = 1;
    const b = 2;
    const sum = a + b;

    const args = [a, b, sum];
    const { status, errorMessage } = await mutate({ cadence, args });

    expect(status).toBe(4);
    expect(errorMessage).toBe("");
  });

  test("single line - failing", async () => {
    const cadence = txSingleLine;
    const a = 1;
    const b = 2;
    const sum = 42;

    const args = [a, b, sum];

    let errorMessage = "";
    try {
      await mutate({ cadence, args });
    } catch (e) {
      errorMessage = e.toString();
    }
    expect(errorMessage.includes("wrong!")).toBe(true);
  });

  test("multi line", async () => {
    const cadence = txMultiLine;
    const a = 1;
    const b = 2;
    const sum = a + b;

    const args = [a, b, sum];
    const { status, errorMessage } = await mutate({ cadence, args });

    expect(status).toBe(4);
    expect(errorMessage).toBe("");
  });

  test("multi line - trailing comma", async () => {
    const cadence = txMultiLineTrailingComma;
    const a = 1;
    const b = 2;
    const sum = a + b;

    const args = [a, b, sum];
    const { status, errorMessage } = await mutate({ cadence, args });

    expect(status).toBe(4);
    expect(errorMessage).toBe("");
  });
});
