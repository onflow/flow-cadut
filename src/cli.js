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

import fs from "fs";
import simpleGit from "simple-git";
import yargs from "yargs";

import { processFolder, processGitRepo } from "./processor";
import "./templates";

// Initially we will support only GitHub repos
// TODO: support other urls. List can be found here:
// https://stackoverflow.com/questions/2514859/regular-expression-for-git-repository
const isGitUrl = (input) => /https:\/\/github.com/.test(input);

export const parseArgs = (argv) => {
  let input, output;
  let branch = argv.branch;

  switch (argv._.length) {
    case 2: {
      input = argv._[0];
      output = argv._[1];
      break;
    }
    case 1: {
      input = argv._[0];
      output = argv.output;
      break;
    }
    default: {
      input = argv.input;
      output = argv.output;
    }
  }

  if (argv._.length === 2) {
    input = argv._[0];
    output = argv._[1];
  }

  return { input, output, branch };
};

export async function run(args) {
  const hideBin = args.slice(2);

  const argv = require("yargs/yargs")(hideBin)
    .alias("i", "input")
    .alias("o", "output")
    .alias("b", "branch")
    .default({ i: "./cadence", o: "./src/generated", dependency: "flow-js-testing" }).argv;
  // console.log(argv)
  const { input, output, branch } = parseArgs(argv);
  console.log({ input, output, branch });

  if (isGitUrl(input)) {
    await processGitRepo(input, output, branch, { dependency });
  } else {
    fs.rmdirSync(output, { recursive: true });
    await processFolder(input, output, { dependency });
  }
}
