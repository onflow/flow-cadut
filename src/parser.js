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

export const generateSchema = (argsDefinition) =>
  argsDefinition
    .split(",")
    .map((item) => item.replace(/\s*/g, ""))
    .filter((item) => item !== "");

export const stripComments = (code) => {
  const commentsRegExp = /(\/\*[\s\S]*?\*\/)|(\/\/.*)/g;
  return code.replace(commentsRegExp, "");
};

export const extract = (code, keyWord) => {
  const noComments = stripComments(code);
  const target = collapseSpaces(noComments.replace(/[\n\r]/g, ""));

  if (target) {
    const regexp = new RegExp(keyWord, "g");
    const match = regexp.exec(target);

    if (match) {
      if (match[1] === "") {
        return [];
      }
      return generateSchema(match[1]);
    }
  }
  return [];
};

export const extractSigners = (code) => {
  return extract(code, `(?:prepare\\s*\\(\\s*)([^\\)]*)(?:\\))`);
};

export const extractScriptArguments = (code) => {
  return extract(code, `(?:fun\\s+main\\s*\\(\\s*)([^\\)]*)(?:\\))`);
};

export const extractTransactionArguments = (code) => {
  return extract(code, `(?:transaction\\s*\\(\\s*)([^\\)]*)(?:\\))`);
};

export const extractContractName = (code) => {
  return extractContractParameters(code).contractName;
};

export const extractContractParameters = (code) => {
  const complexMatcher = /(resource|struct)\s+\w+\s*{[\s\S]+?}/g;
  const contractNameMatcher =
    /(?:access\(\w+\)|pub)\s+contract\s+(?:interface)*\s*(\w*)(\s*{[.\s\S]*init\s*\((.*?)\)[.\s\S]*})?/g;

  const noComments = stripComments(code);
  const noComplex = noComments.replace(complexMatcher, "");
  const matches = contractNameMatcher.exec(noComplex);

  if (!matches || matches.length < 2) {
    throw new Error("Contract Error: can't find name of the contract");
  }

  return {
    contractName: matches[1],
    args: matches[3] || "",
  };
};

export const getTemplateInfo = (template) => {
  const contractMatcher = /\w+\s+contract\s+(\w*\s*)\w*/g;
  const transactionMatcher = /transaction\s*(\(\s*\))*\s*/g;
  const scriptMatcher = /pub\s+fun\s+main\s*/g;

  const code = stripComments(template);

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
    const { contractName, args } = extractContractParameters(code);
    return {
      type: CONTRACT,
      signers: 1,
      args,
      contractName,
    };
  }

  return {
    type: UNKNOWN,
  };
};

export const getPragmaNotes = (template) => {
  const regexp = /\/{3}\s*pragma\s*(.*)/g;
  const matches = template.match(regexp);

  return matches.reduce((acc, line) => {
    const match = line.match(/\/{3}\s*pragma\s+(\w*)\s+(.*)/);
    const [, name, value] = match;
    acc[name] = value;
    return acc;
  }, {});
};
