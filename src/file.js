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
import { resolve, dirname } from "path";
import prettier from "prettier";
import parserBabel from "prettier/parser-babel";
import { underscoreToCamelCase } from "./strings";

/**
 * Syntax sugar for file reading
 * @param {string} path - path to file to be read
 */
export const readFile = (path) => {
  return fs.readFileSync(path, "utf8");
};

/**
 * Syntax sugar for file writing
 * @param {string} path - path to file to be read
 * @param {string} data - data to write into file
 */
export const writeFile = (path, data) => {
  const targetDir = dirname(path);
  fs.mkdirSync(targetDir, { recursive: true });
  return fs.writeFileSync(path, data, { encoding: "utf8" });
};

/**
 * Syntax sugar for removing directory and all it's contents
 * @param {string} path - path to directory to delete
 */
export const clearPath = (path) => {
  fs.rmdirSync(path, { recursive: true });
};

export const getFilesList = async (dir) => {
  const dirents = await fs.promises.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map((dirent) => {
      const res = resolve(dir, dirent.name);
      return dirent.isDirectory() ? getFilesList(res) : res;
    })
  );
  return files.flat();
};

export const sansExtension = (fileName) => {
  return fileName.replace(/\..*/, "");
};

export const prettify = (code) => {
  // Use the same formatting options as in this repository
  // TODO: read prettier config from local folder
  const options = {
    printWidth: 100,
    endOfLine: "lf",
    semi: true,
    useTabs: false,
    singleQuote: false,
    trailingComma: "es5",
    tabWidth: 2,
  };
  return prettier.format(code, { parser: "babel", plugins: [parserBabel], ...options });
};

export const generateExports = async (dir, template) => {
  const entities = await fs.promises.readdir(dir, { withFileTypes: true });

  const currentFolder = entities.reduce(
    (acc, entity) => {
      if (entity.isDirectory()) {
        acc.folders.push(entity);
        acc.folderNames.push(entity.name);
      } else {
        const camelCased = underscoreToCamelCase(entity.name);
        const fileName = sansExtension(camelCased);

        const contractPragma = "/** pragma type contract **/";

        if (entity.isFile()) {
          const filePath = resolve(dir, entity.name);
          const content = fs.readFileSync(filePath, "utf8");
          if (content.includes(contractPragma)) {
            acc.contracts.push(fileName);
          } else {
            acc.files.push(fileName);
          }
        }
      }
      return acc;
    },
    { folderNames: [], folders: [], files: [], contracts: [] }
  );

  currentFolder.name = dir;
  const packageData = template({
    folders: currentFolder.folderNames,
    files: currentFolder.files,
    contracts: currentFolder.contracts,
  });
  writeFile(`${dir}/index.js`, prettify(packageData));

  await Promise.all(
    currentFolder.folders.map((dirent) => {
      const res = resolve(dir, dirent.name);
      return dirent.isDirectory() ? generateExports(res, template) : res;
    })
  );

  return currentFolder;
};
