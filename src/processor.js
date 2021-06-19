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

const extractParams = (input, branch) => {
  // eslint-disable-next-line no-useless-escape
  const groups = /(\w+:\/\/)(.+@)*([\w\d\.]+)(:[\d]+)?\/*(.*)/g.exec(input);

  // TODO: use branch argument to get actual folder value

  const inputPath = groups[5];
  const inputBits = inputPath.split("/");
  const pathBits = inputBits.slice(4);
  const folderPath = pathBits.join("/");

  const [owner, repo] = inputBits;
  const branchValue = inputBits[3];
  const fetchUrl = `https://github.com/${owner}/${repo}`;
  return { folderPath, fetchUrl, branchValue };
};

const TEMP_REPO_FOLDER = path.resolve(process.cwd(), "./temp-generator-repo");
const clean = () => {
  fs.rmdirSync(TEMP_REPO_FOLDER, { recursive: true });
};

export const getBranchesList = (branches, remotes) => {
  const mappedRemotes = remotes.map(item => item.name)
  return branches.map((branch)=>{
    if (branch.startsWith("remote")){
      const sliceLength = `remotes/${remote}/`.length;
      return branch.slice(sliceLength);
    }
    return branch
  })
}

export const processGitRepo = async (input, output, branch, cliOptions = {}) => {
  const git = simpleGit({
    baseDir: process.cwd(),
    binary: "git",
  });

  const { fetchUrl, folderPath } = extractParams(input, branch);

  clean();

  const options = [];
  if (branch) {
    options.concat(["--branch", branch]);
  }

  await git.clone(fetchUrl, TEMP_REPO_FOLDER, options);

  const tempGit = simpleGit({
    baseDir: TEMP_REPO_FOLDER,
    binary: "git",
  });

  const list = await tempGit.branch(["--list", "--all"]);
  const remotes = await tempGit.getRemotes();
  console.log( list.all );
  console.log(remotes)

  // await processFolder(`${TEMP_REPO_FOLDER}/${folderPath}`, output, cliOptions );

  // Teardown
  // clean();
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
