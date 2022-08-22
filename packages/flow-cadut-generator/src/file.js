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

import glob from "glob"
import fs from "fs"
import chokidar from "chokidar"
import {resolve, dirname, join} from "path"
import prettier from "prettier"
import parserBabel from "prettier/parser-babel"
import {underscoreToCamelCase} from "@onflow/flow-cadut"

export const TRANSACTION_PRAGMA = "/** pragma type transaction **/"
export const SCRIPT_PRAGMA = "/** pragma type script **/"
export const CONTRACT_PRAGMA = "/** pragma type contract **/"

/**
 * Syntax sugar for file reading
 * @param {string} path - path to file to be read
 */
export const readFile = path => {
  return fs.readFileSync(path, "utf8")
}

/**
 * Syntax sugar for file writing
 * @param {string} path - path to file to be read
 * @param {string} data - data to write into file
 */
export const writeFile = (path, data) => {
  const targetDir = dirname(path)
  fs.mkdirSync(targetDir, {recursive: true})
  return fs.writeFileSync(path, data, {encoding: "utf8"})
}

/**
 * Syntax sugar for removing directory and all it's contents
 * @param {string} path - path to directory to delete
 */
export const clearPath = path => {
  fs.rmSync(path, {recursive: true})
}

export const getFilesList = async dir => {
  const dirents = await fs.promises.readdir(dir, {withFileTypes: true})
  const files = await Promise.all(
    dirents.map(dirent => {
      const res = resolve(dir, dirent.name)
      return dirent.isDirectory() ? getFilesList(res) : res
    })
  )
  return files.flat()
}

export const sansExtension = fileName => {
  return fileName.replace(/\..*/, "")
}

export const prettify = (code, props) => {
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
    ...props,
  }
  return prettier.format(code, {
    parser: "babel",
    plugins: [parserBabel],
    ...options,
  })
}

export const generateExports = async (dir, template) => {
  const entities = await fs.promises.readdir(dir, {withFileTypes: true})

  const currentFolder = entities.reduce(
    (acc, entity) => {
      if (entity.isDirectory()) {
        acc.folders.push(entity)
        acc.folderNames.push(entity.name)
      } else {
        const camelCased = underscoreToCamelCase(entity.name)
        const fileName = sansExtension(camelCased)

        const contractPragma = "/** pragma type contract **/"

        if (entity.isFile()) {
          const filePath = resolve(dir, entity.name)
          const content = fs.readFileSync(filePath, "utf8")
          if (content.includes(contractPragma)) {
            acc.contracts.push(fileName)
          } else {
            acc.files.push(fileName)
          }
        }
      }
      return acc
    },
    {folderNames: [], folders: [], files: [], contracts: []}
  )

  currentFolder.name = dir
  const packageData = template({
    folders: currentFolder.folderNames,
    files: currentFolder.files,
    contracts: currentFolder.contracts,
  })
  writeFile(`${dir}/index.js`, prettify(packageData))

  await Promise.all(
    currentFolder.folders.map(dirent => {
      const res = resolve(dir, dirent.name)
      return dirent.isDirectory() ? generateExports(res, template) : res
    })
  )

  return currentFolder
}

/**
 * Check if folder structure matches flow-cadut generated folder structure
 * @param {string} path
 * @returns {Promise<boolean>}
 */
export const isGeneratedFolder = async path => {
  const format = {
    "transactions/**/*.js": code => code.trim().startsWith(TRANSACTION_PRAGMA),
    "scripts/**/*.js": code => code.trim().startsWith(SCRIPT_PRAGMA),
    "contracts/**/*.js": code => code.trim().startsWith(CONTRACT_PRAGMA),
    "transactions/**/index.js": true,
    "scripts/**/index.js": true,
    "contracts/**/index.js": true,
    "index.js": true,
  }

  return isDirMatchingFormat(path, format)
}

export const isDirMatchingFormat = async (path, format = {}) => {
  let missingFiles = glob
    .sync(join(path, "**/*"), path)
    .filter(match => fs.lstatSync(match).isFile())
  Object.keys(format).forEach(pattern => {
    const matches = glob
      .sync(join(path, pattern))
      .filter(
        match =>
          format[pattern] === true ||
          format[pattern](fs.readFileSync(match).toString())
      )
    missingFiles = missingFiles.filter(file => !matches.includes(file))
  })
  return missingFiles.length === 0
}

export const debouncedWatcher = (paths, action) => {
  const watcher = chokidar.watch(paths)
  let changes = false,
    mutex = false
  watcher.on("all", async () => {
    changes = true
    if (!mutex) {
      mutex = true
      await new Promise(resolve => setTimeout(() => resolve(), 100))
      while (changes) {
        changes = false
        await action()
      }
      mutex = false
    }
  })
}
