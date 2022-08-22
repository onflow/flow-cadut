import {parseArgs, run} from "../cli"
import {getBranchesList, getParamsFromUrl} from "../processor"
import * as processor from "../processor"
import fs from "fs"

const input = "./cadence"
const output = "./generated"
const branch = "feature/arguments"

const paddedArgs = args => [null, null].concat(args)

describe("CLI parser", () => {
  describe("parseArgs", () => {
    it("shall get input and output flagged params", () => {
      const args = paddedArgs(["-i", input, "-o", output])

      const parsed = parseArgs(args)
      expect(parsed.input).toEqual(input)
      expect(parsed.output).toEqual(output)
    })

    it("shall get input and output alias flagged params", () => {
      const args = paddedArgs(["--input", input, "--output", output])

      const parsed = parseArgs(args)
      expect(parsed.input).toEqual(input)
      expect(parsed.output).toEqual(output)
    })

    it("shall get input and output positional params", () => {
      const args = paddedArgs([input, output])

      const parsed = parseArgs(args)
      expect(parsed.input).toEqual(input)
      expect(parsed.output).toEqual(output)
    })

    it("shall get branch value from params", () => {
      const args = paddedArgs([
        "--input",
        input,
        "--output",
        output,
        "--branch",
        branch,
      ])

      const parsed = parseArgs(args)
      expect(parsed.branch).toEqual(branch)
    })
  })
})

describe("run", () => {
  beforeEach(() => {
    const fsSpy = jest.spyOn(fs, "rmSync")
    fsSpy.mockImplementation(() => {})

    //suppress console.log
    jest.spyOn(console, "log").mockImplementation(() => {})
  })

  it("shall process folders correctly", async () => {
    const processFolderSpy = jest.spyOn(processor, "processFolder")
    processFolderSpy.mockImplementation(() => {})

    const existsSyncSpy = jest.spyOn(fs, "existsSync")
    existsSyncSpy.mockImplementation(path => path === input)

    const args = paddedArgs(["--input", input, "--output", output])
    await run(args)

    expect(processFolderSpy.mock.calls).toEqual([
      [input, output, {dependency: "@onflow/flow-cadut"}],
    ])
  })

  it("shall git repos correctly", async () => {
    const processGitRepoSpy = jest.spyOn(processor, "processGitRepo")
    processGitRepoSpy.mockImplementation(() => {})

    const gitRepoInput = "https://github.com/onflow/test.git"

    const args = paddedArgs(["--input", gitRepoInput, "--output", output])
    await run(args)

    expect(processGitRepoSpy.mock.calls).toEqual([
      [gitRepoInput, output, undefined, {dependency: "@onflow/flow-cadut"}],
    ])
  })

  afterEach(() => {
    jest.resetAllMocks()
  })
})

describe("branch extractor", () => {
  it("shall return empty list", () => {
    const branches = []
    const remotes = []
    const list = getBranchesList(branches, remotes)

    expect(list.length).toBe(0)
  })

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
    ]

    const remotes = [{name: "origin"}]
    const list = getBranchesList(branches, remotes)
    expect(list.length).toBe(branches.length)
  })
})

describe("folder path extractor", () => {
  test("simple test", () => {
    const url =
      "https://github.com/onflow/flow-core-contracts/tree/feature/js-templates/contracts"
    const expectedPath = "./contracts"
    const expectedBranch = "feature/js-templates"

    const branches = ["feature/js-templates"]
    const result = getParamsFromUrl(url, branches)

    expect(result.folderPath).toBe(expectedPath)
    expect(result.branch).toBe(expectedBranch)
  })
})
