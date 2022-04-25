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

import * as fcl from "@onflow/fcl";
import { resolveArguments } from "./args";
import { replaceImportAddresses } from "./imports";
import { config } from "@onflow/config";
import { getEnvironment } from "./env";
import { processSigner } from "./signers";

export const prepareInteraction = async (props, type) => {
  const { code, cadence, args, addressMap, limit, processed } = props;

  // allow to pass code via "cadence" field similar to fcl.query/mutate
  const codeTemplate = code || cadence;

  const env = await getEnvironment();
  const ixAddressMap = {
    ...env,
    ...addressMap,
  };
  const ixCode = processed ? codeTemplate : replaceImportAddresses(codeTemplate, ixAddressMap);

  const ix = type === "script" ? [fcl.script(ixCode)] : [fcl.transaction(ixCode)];

  if (args) {
    const resolvedArgs = await resolveArguments(args, codeTemplate);
    ix.push(fcl.args(resolvedArgs));
  }

  // Handle execution limit
  const defaultLimit = await config().get("ix.executionLimit");
  const fallBackLimit = defaultLimit || 100;

  const ixLimit = limit || fallBackLimit;
  ix.push(fcl.limit(ixLimit));

  if (type === "transaction") {
    const { proposer, payer, signers = [] } = props;
    const ixSigners = signers.length === 0 ? [payer] : signers;
    const ixProposer = proposer || payer;

    ix.push(fcl.payer(processSigner(payer)));
    ix.push(fcl.proposer(processSigner(ixProposer)));
    ix.push(fcl.authorizations(ixSigners.map(processSigner)));
  }

  return fcl.send(ix);
};

/**
 * Sends script code for execution.
 * Returns decoded value.
 */

export const executeScript = async (props) => {
  const { raw = false } = props;
  try {
    const response = await prepareInteraction(props, "script");

    // In some cases one might want to have raw output without decoding the response
    if (raw) {
      return [response.encodedData, null];
    }

    const decoded = await fcl.decode(response);
    return [decoded, null];
  } catch (e) {
    return [null, e];
  }
};

export const waitForStatus = (statusValue) => {
  if (typeof statusValue === "string") {
    const status = statusValue.toLowerCase();
    if (status.includes("final")) {
      return "onceFinalized";
    }

    if (status.includes("exec")) {
      return "onceExecuted";
    }

    if (status.includes("seal")) {
      return "onceSealed";
    }
  }

  // wait for transaction to be sealed by default
  console.log(
    `⚠️ \x1b[33mStatus value \x1b[1m\x1b[35m"${statusValue}"\x1b[33m\x1b[2m is not supported. Reverting to \x1b[32m"onceSealed"\x1b[0m`
  );
  return "onceSealed";
};

/**
 * Submits transaction to emulator network and waits before it will be sealed.
 * Returns transaction result.
 */
export const sendTransaction = async (props) => {
  const { wait = "seal" } = props;
  try {
    const response = await prepareInteraction(props, "transaction");
    if (wait) {
      const waitMethod = waitForStatus(wait);
      const rawResult = await fcl.tx(response)[waitMethod]();
      const txResult = {
        txId: response,
        ...rawResult,
      };
      return [txResult, null];
    }
    return [response.transactionId, null];
  } catch (e) {
    return [null, e];
  }
};

// TODO: add arguments for "init" method into template
export const addContractTemplate = `
    transaction(name: String, code: String) {
      prepare(acct: AuthAccount){
        let decoded = code.decodeHex()
        
        acct.contracts.add(
          name: name,
          code: decoded,
        )
      }
    }
  `;
export const updateContractTemplate = `
  transaction(name: String, code: String){
    prepare(acct: AuthAccount){
      let decoded = code.decodeHex()
      
      if acct.contracts.get(name: name) == nil {
        acct.contracts.add(name: name, code: decoded)
      } else {
        acct.contracts.update__experimental(name: name, code: decoded)
      }
    }
  }
`;

// TODO: add jsdoc
export const hexContract = (contract) => Buffer.from(contract, "utf8").toString("hex");

export const deployContract = async (props) => {
  const {
    name,
    to,
    payer,
    proposer,
    code: contractCode,
    update = false,
    processed = false,
    addressMap = {},
  } = props;

  // Update imprort statement with addresses from addressMap
  const ixContractCode = processed
    ? contractCode
    : replaceImportAddresses(contractCode, addressMap);

  // TODO: Implement arguments for "init" method
  const template = update ? addContractTemplate : updateContractTemplate;

  const hexedCode = hexContract(ixContractCode);
  const args = [name, hexedCode];
  // Set roles
  let ixProposer = to;
  let ixPayer = to;
  let ixSigners = [to];

  if (payer) {
    ixPayer = payer;
    ixProposer = proposer || payer;
  }

  return sendTransaction({
    payer: ixPayer,
    proposer: ixProposer,
    signers: ixSigners,
    code: template,
    args,
  });
};

export const updateContract = async (props) => {
  return deployContract({ ...props, update: true });
};
