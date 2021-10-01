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
        name: "James",
        powerLevel: "3000",
      },
      {
        name: "Hunter",
        powerLevel: "9000",
      },
    ];

    /*
    const meta = {
      name: "James"
    }
     */

    var data = [
      [
        { key: "name", value: "James" },
        { key: "powerLevel", value: "3000" },
      ],

      [
        { key: "name", value: "Hunter" },
        { key: "powerLevel", value: "9000" },
      ],
    ];

    const mapped = mapValuesToCode(cadence, [meta]);

    const result = await query({
      cadence,
      // args: () => mapped,

      args: (arg, t) => {
        /*
        const arrayType = t.Array(t.Dictionary({ key: t.String, value: t.String }));
        const single = [arg(data, arrayType)];
        const singleString = JSON.stringify(single);
        const mappedString = JSON.stringify(mapped);
        console.log({ singleString, mappedString, equal: singleString == mappedString });
        console.log({ arrayType: JSON.stringify(arrayType) });
        */
        return mapped;
      },


    });
    console.log({ result });
  });
});
