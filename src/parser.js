/*
 * Flow JS Testing
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

const contractMatcher = /\w+\s+contract\s+(\w*\s*)\w*/g;
const transactionMatcher = /transaction(\(\s*\))*\s*/g;
const scriptMatcher = /pub\s*fun\s*main\s*/g;

export const extract = (code, keyWord) => {
  const target = code
    .split(/\r\n|\n|\r/)
    .map(collapseSpaces)
    .find((line) => line.includes(keyWord));

  if (target) {
    const match = target.match(/(?:\()(.*)(?:\))/);
    if (match) {
      return match[1].split(",").map((item) => item.replace(/\s*/g, ""));
    }
  }
  return [];
};

export const extractSigners = (code) => {
  return extract(code, "prepare");
};

export const extractScriptArguments = (code) => {
  return extract(code, "fun main");
};

export const extractTransactionArguments = (code) => {
  return extract(code, "transaction");
};

export const getTemplateInfo = (code) => {
  if (code.match(contractMatcher)) {
    return {
      type: CONTRACT,
      signers: 1,
      // TODO: implement extraction from `init` method
      args: []
    };
  }

  if (code.match(transactionMatcher)) {
    const signers = extractSigners(code);
    const args = extractTransactionArguments(code);
    console.log({ args, signers });
    return {
      type: TRANSACTION,
      signers: signers.length,
      args: args,
    };
  }

  if (code.match(scriptMatcher)) {
    const args = extractScriptArguments(code);
    return {
      type: SCRIPT,
      args: args,
    };
  }

  return {
    type: UNKNOWN,
  };
};
