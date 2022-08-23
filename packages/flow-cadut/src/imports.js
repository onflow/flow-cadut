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

  /                               => start of regexp
  import\s+                       => should have keyword import followed by one or more spaces

  ((([\w\d]+)(\s*,\s*))*[\w\d]+)  => >>MATCH[1]<< matcher group for imported contracts (one or more comma separated words including digits)

    ([\w\d]+\s*,\s*)*             => match comma-separated contracts
      [\w\d]+                     => match individual contract name (one or more word or digit)
      \s*,\s*                     => match trailing comma with any amount of space separation

    [\w\d]+                       => match last contract name (mustn't have trailing comma, so separate from previous matcher)
  
  \s+from\s+                      => keyword from with one or more leading and following space characters
  ([\w\d".\\/]+)                  => >>MATCH[3]<< one or more word, digit, "" or / character for address or file import notation
  /                               => end of regexp
*/
export const REGEXP_IMPORT =
  /import\s+(([\w\d]+\s*,\s*)*[\w\d]+)\s+from\s*([\w\d".\\/]+)/

/*
  === REGEXP_IMPORT_CONTRACT ===
  Used to separate individual contract names from comma/space separarated list of contracts

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

  return [...code.matchAll(new RegExp(REGEXP_IMPORT, "g"))].reduce(
    (contracts, match) => {
      const contractsStr = match[1],
        address = match[3]

      contractsStr.match(REGEXP_IMPORT_CONTRACT).forEach(contract => {
        contracts[contract] = address
      })
      return contracts
    },
    {}
  )
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
 * @param {{string:string}} [addressMap={}] - name/address map or function to use as lookup table
 * for addresses in import statements.
 * @param byName - lag to indicate whether we shall use names of the contracts.
 * @returns {*}
 */
export const replaceImportAddresses = (code, addressMap, byName = true) => {
  return code.replace(REGEXP_IMPORT, importLine => {
    const contracts = extractImports(importLine)
    const contractMap = Object.keys(contracts).reduce((map, contract) => {
      const address = contracts[contract]
      const key = byName ? contract : address
      const newAddress =
        addressMap instanceof Function ? addressMap(key) : addressMap[key]

      // If the address is not inside addressMap we shall not alter import statement
      const validAddress = newAddress || address
      map[validAddress] = (map[validAddress] ?? []).concat(contract)
      return map
    }, {})

    return Object.keys(contractMap)
      .reduce((res, addr) => {
        const contractsStr = contractMap[addr].join(", ")
        return res.concat(`import ${contractsStr} from ${addr}`)
      }, [])
      .join("\n")
  })
}
