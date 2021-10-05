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

export { getEnvironment, setEnvironment } from "./env";

export {
  extractImports,
  missingImports,
  reportMissingImports,
  report,
  replaceImportAddresses,
} from "./imports";

export {
  reportArguments,
  reportMissing,
  mapArguments,
  mapArgument,
  mapValuesToCode,
  splitArgs,
  argType,
  getDictionaryTypes,
  getArrayType,
} from "./args";

export {
  extract,
  extractSigners,
  extractScriptArguments,
  extractTransactionArguments,
  extractContractName,
  extractContractParameters,
  getTemplateInfo,
  generateSchema,
  CONTRACT,
  TRANSACTION,
  SCRIPT,
} from "./parser";

export {
  collapseSpaces,
  trimAndSplit,
  underscoreToCamelCase,
  getSplitCharacter,
  capitalizeFirstLetter,
} from "./strings";

export { executeScript, sendTransaction, deployContract, updateContract } from "./interactions";

// Below is a set of aliases to bring it in line with FCL
export { executeScript as query, sendTransaction as mutate } from "./interactions";
