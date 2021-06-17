import { parseArgs } from "../src/cli";

const input = "./cadence";
const output = "./generated";
const branch = "feature/arguments";

describe("CLI parser", () => {
  it("shall get input and output from params", () => {
    const args = {
      _: [],
      input,
      output,
    };

    const parsed = parseArgs(args);
    expect(parsed.input).toEqual(input);
    expect(parsed.output).toEqual(output);
  });

  it("shall get input from non prefixed values", () => {
    const simpleInput = "./test";
    const args = {
      _: [simpleInput],
      input,
      output,
    };

    const parsed = parseArgs(args);
    expect(parsed.input).toEqual(simpleInput);
    expect(parsed.output).toEqual(output);
  });

  it("shall get input and output from non prefixed values", () => {
    const simpleInput = "./test";
    const simpleOutput = "./output";
    const args = {
      _: [simpleInput, simpleOutput],
      input,
      output,
    };

    const parsed = parseArgs(args);
    expect(parsed.input).toEqual(simpleInput);
    expect(parsed.output).toEqual(simpleOutput);
  });

  it("shall get branch value from params", () => {
    const args = {
      _: [],
      input,
      output,
      branch,
    };

    const parsed = parseArgs(args);
    expect(parsed.branch).toEqual(branch);
  });
});
