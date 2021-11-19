import { extractName, isFindAddress } from "../../plugins/FIND/src/utils";

describe("FIND library", () => {
  test("shall properly match address", () => {
    const inputs = [
      // suffixed values
      "flow.find",
      "-flow-.find",

      // prefixed values
      "find:flow",
      "find:   flow",
      "find:  -flow-is-great-",
    ];
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      const output = isFindAddress(input);
      expect(output).toBe(true);
    }
  });

  test("shall properly invalidate incorrect address", () => {
    const inputs = [
      "0x6f265aa45d8b4875",
      "0x01",
      "flow",
      "this-is-valid-address-but-it-is-too-long",
    ];
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      const output = isFindAddress(input);
      console.log({ input, output });
      expect(output).toBe(false);
    }
  });

  test("extract name", () => {
    const inputs = ["find: flow", "flow.find", "find:      --flow--"];
    const outputs = ["flow", "flow", "--flow--"];
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      const output = outputs[i];
      const result = extractName(input);
      console.log({ input, output, result });
      expect(result).toBe(output);
    }
  });
});
