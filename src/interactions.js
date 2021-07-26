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

export const prepareInteraction = async (props, type) => {
  const { code, args, addressMap, limit } = props;

  const ixCode = replaceImportAddresses(code, addressMap);
  const ixLimit = limit || 100;

  const ix = type === "script" ? [fcl.script(ixCode)] : [fcl.transaction(ixCode)];

  if (args) {
    ix.push(fcl.args(resolveArguments(args, code)));
  }

  ix.push(fcl.limit(ixLimit));

  if (type === "transaction") {
    const { proposer, payer, signers = [] } = props;
    const ixSigners = signers.length === 0 ? [payer] : signers;
    const ixProposer = proposer || payer;

    ix.push(fcl.payer(payer));
    ix.push(fcl.proposer(ixProposer));
    ix.push(fcl.authorizations(ixSigners));
  }

  return fcl.send(ix);
};

/**
 * Sends script code for execution.
 * Returns decoded value.
 */

export const executeScript = async (props) => {
  try {
    const response = await prepareInteraction(props, "script");
    const result = await fcl.decode(response);
    return [result, null];
  } catch (e) {
    return [null, e.message];
  }
};

/**
 * Submits transaction to emulator network and waits before it will be sealed.
 * Returns transaction result.
 */
export const sendTransaction = async (props, waitForExecution = true) => {
  try {
    const response = await prepareInteraction(props, "transaction");
    if (waitForExecution) {
      const txResult = await fcl.tx(response).onceExecuted();
      return [txResult, null];
    }
    return [response, null];
  } catch (e) {
    return [null, e.message];
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
  const { name, to, payer, proposer, update = false, code: contractCode } = props;

  // TODO: Implement arguments for "init" method
  const template = update ? addContractTemplate : updateContractTemplate;

  const hexedCode = hexContract(contractCode);
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
