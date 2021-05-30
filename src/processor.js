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

import { resolve } from "path";
import Handlebars from "handlebars";
import { getSplitCharacter, trimAndSplit, underscoreToCamelCase } from "./strings";
import { generateExports, getFilesList, readFile, writeFile } from "./file";
import { getTemplateInfo, CONTRACT, SCRIPT, TRANSACTION, extractSigners } from "./parser";

export const processFolder = async (input, output, options = {}) => {
  const splitCharacter = getSplitCharacter(input);
  const fullBasePath = `${resolve(input)}${splitCharacter}`;
  const fileList = await getFilesList(input);

  for (let i = 0; i < fileList.length; i++) {
    const path = fileList[i];
    const packages = trimAndSplit(path, fullBasePath);
    const pathPackages = packages.slice(0, -1);
    const file = packages.slice(-1)[0];

    const ixDependency = options.ixDependency || "flow-js-testing";

    const code = readFile(path);
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
