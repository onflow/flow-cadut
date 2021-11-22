import path from "path";
import { emulator, init } from "flow-js-testing";
import { query } from "@onflow/fcl";
import { mapValuesToCode } from "../../src";
import { padAddress, toFixedValue } from "../../src/fixer";

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

  it("failing split", async () => {
    const input = ["Hello"];
    const cadence = `
      pub fun main(message: String):String {
        return message
      }
    `;

    const values = await mapValuesToCode(cadence, input)
    const args = () => values;
    const output = await query({ cadence, args });

    expect(output).toBe(input[0]);
  });

  it("basic - UFix64 and Address", async () => {
    const input = [1337, "0x01"];
    const cadence = `
      pub fun main(number: UFix64, address: Address):UFix64{
        return number
      }
    `;

    const values = await mapValuesToCode(cadence, input)
    const args = () => values;
    const output = await query({ cadence, args });

    expect(output).toBe(toFixedValue(input[0]));
  });

  it("empty array", async () => {
    const input = [[]];
    const cadence = `
      pub fun main(arr:[String]):[String]{
        return arr
      }
    `;
    const values = await mapValuesToCode(cadence, input)
    const args = () => values;
    const output = await query({ cadence, args });

    expect(output.length).toBe(0);
  });

  it("Path", async () => {
    const input = ["/public/collection"];
    const cadence = `
      pub fun main(path: Path):Path{
        return path
      }
    `;

    const values = await mapValuesToCode(cadence, input)
    const args = () => values;
    const output = await query({ cadence, args });

    expect(output.domain).toBe("public");
    expect(output.identifier).toBe("collection");
  });

  it("optionals - String? - no value", async () => {
    const input = null;
    const cadence = `
      pub fun main(message: String?): String?{
        return message
      }
    `;

    const values = await mapValuesToCode(cadence, [input])
    const args = () => values;
    const output = await query({ cadence, args });

    expect(output).toBe(input);
  });
  it("optionals - String? - with value", async () => {
    const input = "Cadence";
    const cadence = `
      pub fun main(message: String?): String?{
        return message
      }
    `;

    const values = await mapValuesToCode(cadence, [input])
    const args = () => values;
    const output = await query({ cadence, args });

    expect(output).toBe(input);
  });
  it("optionals - Address? - no value", async () => {
    const input = null;
    const expected = false;
    const cadence = `
      pub fun main(address: Address?): Bool{
        if(address != nil){
          return true
        }
        return false
      }
    `;

    const values = await mapValuesToCode(cadence, [input])
    const args = () => values;
    const output = await query({ cadence, args });

    expect(output).toBe(expected);
  });
  it("optionals - Address? - with value", async () => {
    const input = "0x01";
    const expected = true;
    const cadence = `
      pub fun main(address: Address?): Bool{
        if(address != nil){
          return true
        }
        return false
      }
    `;

    const values = await mapValuesToCode(cadence, [input])
    const args = () => values;
    const output = await query({ cadence, args });

    expect(output).toBe(expected);
  });
  it("optionals - [String?] - no value", async () => {
    const input = [null];
    const expected = null;
    const cadence = `
      pub fun main(names: [String?]): String?{
          return names[0]
      }
    `;

    const values = await mapValuesToCode(cadence, [input])
    const args = () => values;
    const output = await query({ cadence, args });

    expect(output).toBe(expected);
  });
  it("optionals - [String?] - with value", async () => {
    const input = ["Cadence"];
    const expected = "Cadence";
    const cadence = `
      pub fun main(names: [String?]): String?{
          return names[0]
      }
    `;

    const values = await mapValuesToCode(cadence, [input])
    const args = () => values;
    const output = await query({ cadence, args });

    expect(output).toBe(expected);
  });
  it("optionals - {String: String?} - no value", async () => {
    const input = { name: "Cadence" };
    const expected = null;
    const cadence = `
      pub fun main(metadata: {String: String?}): String?{
          log(metadata)
          let meta = metadata["empty"]
          if ( meta == nil){
            return nil
          }
          return meta!
      }
    `;

    const values = await mapValuesToCode(cadence, [input])
    const args = () => values;
    const output = await query({ cadence, args });

    expect(output).toBe(expected);
  });
  it("optionals - {String: String?} - with value", async () => {
    const input = { name: "Cadence" };
    const expected = "Cadence";
    const cadence = `
      pub fun main(metadata: {String: String?}): String?{
          return metadata["name"]!
      }
    `;

    const values = await mapValuesToCode(cadence, [input])
    const args = () => values;
    const output = await query({ cadence, args });

    expect(output).toBe(expected);
  });
  it("case suit", async () => {
    const makeTemplate = (type) => `
      pub fun main(message: ${type}?): ${type}?{
          return message
      }  
    `;

    const StringMap = `
      pub fun main(metadata: {String: String?}, key: String): String?{
          return metadata[key]!
      }  
      `;

    const StringArray = `
      pub fun main(names: [String?]): String?{
          return names[0]
      }  
    `;

    const templates = {
      UFix64: makeTemplate("UFix64"),
      String: makeTemplate("String"),
      Address: makeTemplate("Address"),
    };

    const tests = [
      {
        input: "Cadence",
        cadence: templates.String,
      },
      {
        input: null,
        cadence: templates.String,
      },
      {
        input: toFixedValue(1.337),
        cadence: templates.UFix64,
      },
      {
        input: null,
        cadence: templates.UFix64,
      },
      {
        input: padAddress("0x01"),
        cadence: templates.Address,
      },
      {
        input: null,
        cadence: templates.Address,
      },
      {
        input: ["Cadence"],
        cadence: StringArray,
        expected: "Cadence",
      },
      {
        input: [null],
        cadence: StringArray,
        expected: null,
      },
      {
        rawArgs: [
          {
            name: "James",
          },
          "name",
        ],
        cadence: StringMap,
        expected: "James",
      },
    ];

    for (const i in tests) {
      const { input, expected, cadence, rawArgs } = tests[i];

      const mapped = await mapValuesToCode(cadence, rawArgs || [input]);
      const args = () => mapped;
      const output = await query({ cadence, args });
      await expect(output).toBe(expected === undefined ? input : expected);
    }
    await expect.assertions(tests.length);
  });
});
