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
import path from "path";
import { resolve } from "path";
import Handlebars from "handlebars";
import simpleGit from "simple-git";

import { getSplitCharacter, trimAndSplit, underscoreToCamelCase } from "./strings";
import { generateExports, getFilesList, readFile, writeFile } from "./file";
import { getTemplateInfo, CONTRACT, SCRIPT, TRANSACTION, extractSigners } from "./parser";

const getFetchUrl = (input) => {
  // eslint-disable-next-line no-useless-escape
  const groups = /(\w+:\/\/)(.+@)*([\w\d\.]+)(:[\d]+)?\/*(.*)/g.exec(input);

  const inputPath = groups[5];
  const inputBits = inputPath.split("/");

  const [owner, repo] = inputBits;
  // TODO: use actual path with password and user
  return `https://github.com/${owner}/${repo}`;
};

const TEMP_REPO_FOLDER = path.resolve(process.cwd(), "./temp-generator-repo");
const clean = () => {
  fs.rmdirSync(TEMP_REPO_FOLDER, { recursive: true });
};

export const getBranchesList = (branches, remotes) => {
  const mappedRemotes = remotes.map((item) => item.name);

  return branches.map((branch) => {
    for (let i = 0; i < mappedRemotes.length; i++) {
      const remote = mappedRemotes[i];
      const suffix = `remotes/${remote}/`;
      if (branch.startsWith(suffix)) {
        const sliceLength = suffix.length;
        return branch.slice(sliceLength);
      }
    }
    return branch;
  });
};

export const getParamsFromUrl = (url, branches) => {
  for (let i = 0; i < branches.length; i++) {
    const branch = branches[i];
    const part = `tree/${branch}/`;
    const index = url.indexOf(part);
    if (index >= 0) {
      return {
        branch,
        fetchUrl: url.slice(0, index - 1),
        folderPath: `./${url.slice(index + part.length)}`,
      };
    }
  }
  return {
    fetchUrl: url,
    folderPath: "./",
  };
};

export const processGitRepo = async (input, output, branch, cliOptions = {}) => {
  const git = simpleGit({
    baseDir: process.cwd(),
    binary: "git",
  });

  const fetchUrl = getFetchUrl(input);

  console.log("Preparing space");
  clean();

  const options = [];

  console.log(`Cloning ${fetchUrl} repository to local machine`);
  await git.clone(fetchUrl, TEMP_REPO_FOLDER, options);

  const tempGit = simpleGit({
    baseDir: TEMP_REPO_FOLDER,
    binary: "git",
  });

  console.log("Extracting branch name and folder path from url");
  const branchList = await tempGit.branch(["--list", "--all"]);
  const remotes = await tempGit.getRemotes();
  const branches = getBranchesList(branchList.all, remotes);
  const params = getParamsFromUrl(input, branches);

  if (params.branch) {
    console.log(`Branch name: ${params.branch}`);
    console.log(`Check out ${params.branch} branch`);
    tempGit.checkout(params.branch);
  }

  console.log("Processing Cadence template files");
  await processFolder(`${TEMP_REPO_FOLDER}/${params.folderPath}`, output, cliOptions);

  // Teardown
  console.log("Cleaning up");
  clean();

  console.log("Done!");
};

export const processFolder = async (input, output, options = {}) => {
  const splitCharacter = getSplitCharacter(input);
  const fullBasePath = `${resolve(input)}${splitCharacter}`;
  const fileList = await getFilesList(input);

  for (let i = 0; i < fileList.length; i++) {
    const path = fileList[i];

    // Skip all but Cadence template files
    if (!path.endsWith(".cdc")) {
      continue;
    }

    const packages = trimAndSplit(path, fullBasePath);
    const pathPackages = packages.slice(0, -1);
    const file = packages.slice(-1)[0];

    const ixDependency = options.dependency || "flow-js-testing";

    const code = readFile(path).replace(/`/g, "'");
    const name = underscoreToCamelCase(file.replace(".cdc", ""));

    const templateInfo = getTemplateInfo(code);

    let argsAmount = 0;
    if (templateInfo.args) {
      argsAmount = templateInfo.args.length;
    }

    let data;
    switch (templateInfo.type) {
      case SCRIPT:
        data = Handlebars.templates.script({
          code,
          name,
          ixDependency,
          argsAmount,
          assetName: name,
        });
        break;
      case TRANSACTION: {
        const signers = extractSigners(code);
        data = Handlebars.templates.transaction({
          code,
          name,
          ixDependency,
          argsAmount,
          signersAmount: signers.length,
          assetName: name,
        });
        break;
      }
      case CONTRACT: {
        const contractName = templateInfo.contractName;
        data = Handlebars.templates.contract({
          code,
          name,
          ixDependency,
          contractName,
          assetName: name,
        });
        break;
      }
      default:
        // TODO: implement empty plug
        data = "// Unsupported file";
    }

    const templateFolder = pathPackages.join(`/`);
    const filePath = `${output}/${templateFolder}/${name}.js`;

    writeFile(filePath, data);
  }

  // Generate index.js exports in each folder
  await generateExports(output, Handlebars.templates.package);
};
