/*
 * Flow Template Utilities
 *
 * Copyright 2021 Dapper Labs, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import yargs from "yargs"
import {hideBin} from "yargs/helpers"

import fs from "fs"

import {processFolder, processGitRepo} from "./processor"
import "./templates"
import {debouncedWatcher} from "./file"
import assert from "assert"

// Initially we will support only GitHub repos
// TODO: support other urls. List can be found here:
// https://stackoverflow.com/questions/2514859/regular-expression-for-git-repository
const isGitUrl = input => /https:\/\/github.com/.test(input)

export const parseArgs = args =>
  yargs(hideBin(args)).command(
    "$0 [input] [output]",
    "Generate corresponding JavaScript files from a cadence input folder",
    yargs => {
      yargs.options({
        i: {
          alias: "input",
          default: "./cadence",
          description: "Cadence input directory or Github repository URL",
          type: "string",
        },
        o: {
          alias: "output",
          default: "./src/generated",
          description: "Javascript output directory",
          type: "string",
        },
        b: {
          alias: "branch",
          description: "Git branch to use if git repository used as input",
          type: "string",
        },
        d: {
          alias: "dependency",
          default: "@onflow/flow-cadut",
          description: "Dependency to use in generated templates",
          type: "string",
        },
        w: {
          alias: "watch",
          default: false,
          description:
            "Whether to run the generator as a standalone build or in watch mode",
          type: "boolean",
        },
      })
    }
  ).argv

export async function run(args) {
  const {input, output, branch, dependency, watch} = parseArgs(args)

  assert(
    !watch || !isGitUrl(input),
    "Watching a git repository is not supported"
  )
  assert(
    !branch || isGitUrl(input),
    "The branch argument can only be used if a git repository is used as an input"
  )

  const generate = async () => {
    console.log("Generating JavaScript files...")
    fs.rmSync(output, {recursive: true})
    if (isGitUrl(input)) {
      await processGitRepo(input, output, branch, {dependency})
    } else {
      await processFolder(input, output, {dependency})
    }
    console.log("Success!")
  }

  if (watch) {
    await debouncedWatcher(input, generate)
  } else {
    await generate()
  }
}
