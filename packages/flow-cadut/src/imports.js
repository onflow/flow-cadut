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

/*
  === REGEXP_IMPORT explanation ===
  Matches import line in cadence code and is used for extracting address & list of contracts imported

  /                                             => start of regexp
      ^                                         => Matches the start of the string.
      \s*                                       => Matches zero or more whitespace characters.
      import\s+                                 => Matches the word "import" followed by one or more whitespace characters.
      ("?([\w\d]+\s*,\s*)*(?!from\b)[\w\d]+"?)  => Matches a list of one or more variable names separated by commas,
                                                   with each variable name optionally surrounded by quotes (?"), and optional
                                                   whitespace characters in between ([\w\d]+\s*,\s*)*. The negative lookahead
                                                   assertion (?!from\b) ensures that the word "from" is not part of a
                                                   variable name. The entire list of variable names is optionally surrounded
                                                   by quotes as well (?").
      \s*                                       => Matches zero or more whitespace characters.
      (?:from)?                                 => Matches the word "from" if it appears, but does not capture it.
      \s*                                       => Matches zero or more whitespace characters.
    ([\w\d".\/]+)?                              => Matches the target path, which is a sequence of one or more
                                                   alphanumeric characters, quotes ("), periods (.), forward slashes (/),
                                                   or double quotes (").
      $                                         => Matches the end of the string.
  /                                             => end of regexp

*/
export const REGEXP_IMPORT =
  /\s*import\s+("?([\w\d]+\s*,\s*)*(?!from\b)[\w\d]+"?)\s*(?:from)?\s*([\w\d"./]+)?$/gm

/*
  === REGEXP_IMPORT_CONTRACT ===
  Used to separate individual contract names from comma/space separated list of contracts

  /                               => start of regexp
  ([\w\d]+)                       => >>MATCH[1]<< match individual contract name (one or more word or digit)
  /g                              => end of regexp, g - global flag (find all)
*/
export const REGEXP_IMPORT_CONTRACT = /([\w\d]+)/g

/**
 * Returns address map for contracts defined in template code.
 * @param {string} code - Cadence code to parse.
 * @returns {*}
 */
export const extractImports = code => {
  if (!code || code.length === 0) {
    return {}
  }

  const lines = [...code.matchAll(REGEXP_IMPORT)]
  return lines.reduce((contracts, match) => {
    const contractsStr = match[1],
      address = match[3]

    contractsStr.match(REGEXP_IMPORT_CONTRACT).forEach(contract => {
      contracts[contract] = address
    })
    return contracts
  }, {})
}

/**
 * Returns list of missing imports.
 * @param {string} code - template cadence code
 * @param {Object.<string, string>} addressMap - contract name as a key and address where it's deployed as value
 */
export const missingImports = (code, addressMap = {}) => {
  const importsList = extractImports(code)
  const missing = []

  for (const key in importsList) {
    if (
      !addressMap[key] &&
      Object.prototype.hasOwnProperty.call(importsList, key)
    ) {
      missing.push(key)
    }
  }

  return missing
}

/**
 * Reports missing imports.
 * @param {Array.<string>} list - list of missing imports
 * @param {string} prefix - error message prefix
 */
export const report = (list = [], prefix = "") => {
  const errorMessage = `Missing imports for contracts:`
  const message = prefix ? `${prefix} ${errorMessage}` : errorMessage
  console.error(message, list)
}

/**
 * Reports missing imports.
 * @param {string} code - template cadence code
 * @param {Object.<string, string>} addressMap - contract name as a key and address where it's deployed as value
 * @param {string} [prefix] - prefix to add to error message
 */
export const reportMissingImports = (code, addressMap, prefix = "") => {
  const list = missingImports(code, addressMap)
  if (list.length > 0) {
    report(list, prefix)
  }
}

/**
 * Returns Cadence template code with replaced import addresses
 * @param {string} code - Cadence template code.
 * @param {{[key:string]:string}} [addressMap={}] - name/address map or function to use as lookup table
 * for addresses in import statements.
 * @param byName - lag to indicate whether we shall use names of the contracts.
 * @returns {*}
 */
export const replaceImportAddresses = (code, addressMap, byName = true) => {
  const EMPTY = "empty"
  return code.replace(REGEXP_IMPORT, importLine => {
    const contracts = extractImports(importLine)

    const contractMap = Object.keys(contracts).reduce((map, contract) => {
      const address = contracts[contract]

      const key = byName ? contract : address
      const newAddress =
        addressMap instanceof Function ? addressMap(key) : addressMap[key]

      // If the address is not inside addressMap we shall not alter import statement
      let validAddress = newAddress || address

      if (!newAddress || contract === "Crypto") {
        validAddress = EMPTY
      }

      if (!map[validAddress]) {
        map[validAddress] = []
      }

      map[validAddress] = map[validAddress].concat(contract)
      return map
    }, {})

    return Object.keys(contractMap)
      .reduce((res, addr) => {
        const contractsStr = contractMap[addr].join(", ")
        if (addr === EMPTY) {
          return res.concat(`import ${contractsStr}`)
        }
        return res.concat(`import ${contractsStr} from ${addr} `)
      }, [])
      .join("\n")
  })
}
