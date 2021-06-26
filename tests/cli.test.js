import { parseArgs } from "../src/cli";
import { getBranchesList, getParamsFromUrl } from "../src/processor";

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

describe("branch extractor", () => {
  it("shall return empty list", () => {
    const branches = [];
    const remotes = [];
    const list = getBranchesList(branches, remotes);

    expect(list.length).toBe(0);
  });

  it("shall return formatted list of branches", () => {
    const branches = [
      "master",
      "remotes/origin/feature/epochs",
      "remotes/origin/feature/js-templates",
      "remotes/origin/josh/freeze",
      "remotes/origin/josh/test-on-testnet",
      "remotes/origin/kan/staking-id-bench",
      "remotes/origin/kan/test-on-testnet",
      "remotes/origin/master",
      "remotes/origin/max/js-test-tools",
      "remotes/origin/max/storage-testing",
      "remotes/origin/template-manifest-sample-values",
    ];

    const remotes = [{ name: "origin" }];
    const list = getBranchesList(branches, remotes);
    expect(list.length).toBe(branches.length);
  });
});

describe("folder path extractor", () => {
  test("simple test", () => {
    const url = "https://github.com/onflow/flow-core-contracts/tree/feature/js-templates/contracts";
    const expectedPath = "./contracts";
    const expectedBranch = "feature/js-templates";

    const branches = ["feature/js-templates"];
    const result = getParamsFromUrl(url, branches);

    expect(result.folderPath).toBe(expectedPath);
    expect(result.branch).toBe(expectedBranch);
  });
});
