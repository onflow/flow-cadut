import { collapseSpaces } from "./strings";

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

const contractMatcher = /\w+\s+contract\s+(\w*\s*)\w*/g;
const transactionMatcher = /transaction(\(\s*\))*\s*/g;
const scriptMatcher = /pub\s*fun\s*main\s*/g;

export const CONTRACT = "contract";
export const TRANSACTION = "transaction";
export const SCRIPT = "script";
export const UNKNOWN = "unknown";

export const getTemplateInfo = (code) => {
  if (code.match(contractMatcher)) {
    return {
      type: CONTRACT,
      signers: 1,
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
