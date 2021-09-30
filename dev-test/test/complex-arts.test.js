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

  test("single line arguments", async () => {
    const cadence = `
      pub fun main(meta: [{ String: String }]): {String: String} {
        return meta[0]
      }
    `;

    const meta = [
      {
        name: "first",
        powerLevel: "James",
      },
      {
        name: "second",
        powerLevel: "Hunter",
      },
    ];

    var data = [
      [
        { key: "first", value: "James" },
        { key: "second", value: "Hunter" },
      ],

      [
        { key: "foo1", value: "bar1" },
        { key: "woot1", value: "boot1" },
      ],
    ];

    const mapped = mapValuesToCode(cadence, [meta]);

    const result = await query({
      cadence,
      // args: () => mapped,

      args: (arg, t) => {
        const single = arg(data, t.Array(t.Dictionary({ key: t.String, value: t.String })));
        console.log({ single: JSON.stringify(single) });
        return [single];
      },

    });
    console.log({ result });
  });
});
