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

    ix.push(fcl.payer(payer));
    ix.push(fcl.proposer(proposer));
    ix.push(fcl.authorizations(ixSigners));
  }

  return fcl.send(ix);
};

/**
 * Sends script code for execution.
 * Returns decoded value.
 */

export const executeScript = async (props) => {
  const response = await prepareInteraction(props, "script");
  console.log({ response });
  return fcl.decode(response);
};

/**
 * Submits transaction to emulator network and waits before it will be sealed.
 * Returns transaction result.
 */
export const sendTransaction = async (props) => {
  return prepareInteraction(props, "transaction");
};

// TODO: Implement contract interactions
export const deployContract = async (props) => {
  throw new Error("not implemented");
};

export const updateContract = async (props) => {
  throw new Error("not implemented");
};
