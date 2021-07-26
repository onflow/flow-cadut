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

import { collapseSpaces } from "./strings";

export const CONTRACT = "contract";
export const TRANSACTION = "transaction";
export const SCRIPT = "script";
export const UNKNOWN = "unknown";

export const extract = (code, keyWord) => {
  const target = code
    .split(/\r\n|\n|\r/)
    .map(collapseSpaces)
    .find((line) => {
      return new RegExp(keyWord, "g").test(line);
    });

  if (target) {
    const match = target.match(/(?:\()(.*)(?:\))/);
    if (match) {
      if (match[1] === "") {
        return [];
      }
      return match[1].split(",").map((item) => item.replace(/\s*/g, ""));
    }
  }
  return [];
};

export const extractSigners = (code) => {
  return extract(code, "prepare");
};

export const extractScriptArguments = (code) => {
  return extract(code, "fun\\s+main");
};

export const extractTransactionArguments = (code) => {
  return extract(code, `transaction\\s*(?:\\()(.*)(?:\\))`);
};

export const extractContractName = (code) => {
  const contractNameMatcher = /\w+\s+contract\s+(?:interface)*\s*(\w*)/g;
  const singleLine = code.replace(/\r\n|\n|\r/g, " ");
  const matches = contractNameMatcher.exec(singleLine);

  if (matches.length < 2) {
    throw new Error("Contract Error: can't find name of the contract");
  }

  return matches[1];
};

export const getTemplateInfo = (code) => {
  const contractMatcher = /\w+\s+contract\s+(\w*\s*)\w*/g;
  const transactionMatcher = /transaction\s*(\(\s*\))*\s*/g;
  const scriptMatcher = /pub\s+fun\s+main\s*/g;

  if (transactionMatcher.test(code)) {
    const signers = extractSigners(code);
    const args = extractTransactionArguments(code);
    return {
      type: TRANSACTION,
      signers: signers.length,
      args: args,
    };
  }

  if (scriptMatcher.test(code)) {
    const args = extractScriptArguments(code);
    return {
      type: SCRIPT,
      args: args,
    };
  }

  if (contractMatcher.test(code)) {
    // TODO: implement extraction from `init` method
    const contractName = extractContractName(code);
    return {
      type: CONTRACT,
      signers: 1,
      args: [],
      contractName,
    };
  }

  return {
    type: UNKNOWN,
  };
};
