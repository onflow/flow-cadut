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

import { config } from "@onflow/config";

export const DEPLOYED_CONTRACTS = {
  emulator: {
    FungibleToken: "0xee82856bf20e2aa6",

    FlowFees: "0xe5a8b7f23e8b548f",
    FlowStorageFees: "0xf8d6e0586b0a20c7",
    FlowToken: "0x0ae53cb6e3f42a79",
  },
  testnet: {
    FungibleToken: "0x9a0766d93b6608b7",
    NonFungibleToken: "0x631e88ae7f1d7c20",

    FlowClusterQC: "0x9eca2b38b18b5dfe",
    FlowDKG: "0x9eca2b38b18b5dfe",
    FlowEpoch: "0x9eca2b38b18b5dfe",
    FlowIDTableStaking: "0x9eca2b38b18b5dfe",
    FlowToken: "0x7e60df042a9c0868",
    LockedTokens: "0x95e019a17d0e23d7",
    StakingProxy: "0x7aad92e5a0715d21",
    FlowStakingCollection: "0x95e019a17d0e23d7",

    FUSD: "0xe223d8a629e49c68",
  },
  mainnet: {
    FungibleToken: "0xf233dcee88fe0abe",
    NonFungibleToken: "0x1d7e57aa55817448",

    FlowClusterQC: "0x8624b52f9ddcd04a",
    FlowDKG: "0x8624b52f9ddcd04a",
    FlowEpoch: "0x8624b52f9ddcd04a",
    FlowIDTableStaking: "0x8624b52f9ddcd04a",
    FlowFees: "0xf919ee77447b7497",
    FlowToken: "0x1654653399040a61",
    LockedTokens: "0x8d0e87b65159ae63",
    StakingProxy: "0x62430cf28c26d095",
    FlowStakingCollection: "0x8d0e87b65159ae63",

    FUSD: "0x3c5959b568896393",
  },
};

export const EXT_ENVIRONMENT = {
  emulator: {},
  testnet: {},
  mainnet: {},
};

export const extendEnvironment = (branch) => {
  for (const key of Object.keys(EXT_ENVIRONMENT)){
    const value = branch[key];
    const { name } = branch;
    const branchValue = typeof branch[key] === "object" ? value : { [name]: value };
    EXT_ENVIRONMENT[key] = {
      ...EXT_ENVIRONMENT[key],
      ...branchValue,
    };
  }
};

export const ACCESS_NODES = {
  mainnet: "https://access-mainnet-beta.onflow.org",
  testnet: "https://access-testnet.onflow.org",
  emulator: "http://localhost:8080",
};

export const getEnvironmentName = async () => {
  return (await config().get("ix.env")) || "emulator";
};

export const getEnvironment = async () => {
  const env = await getEnvironmentName();
  const core = DEPLOYED_CONTRACTS[env] || DEPLOYED_CONTRACTS.emulator;
  const extended = EXT_ENVIRONMENT[env] || EXT_ENVIRONMENT.emulator;

  return {
    ...core,
    ...extended,
  };
};

export const setEnvironment = async (networkName = "emulator", options = {}) => {
  const network = networkName.toLowerCase();

  if (!DEPLOYED_CONTRACTS[network]) {
    throw new Error(
      `Provided value "${network}" is not supported. Try "emulator", "testnet" or "mainnet". Default: "emulator"`
    );
  }

  const { port, endpoint, limit, extend } = options;
  const portBased =
    network === "emulator" && port ? `http://localhost:${port}` : ACCESS_NODES[network];
  const accessNode = endpoint || portBased;

  await config().put("ix.env", network);

  if (limit) {
    await config().put("ix.executionLimit", limit);
  }

  if (extend){
    extendEnvironment(extend)
  }

  await config().put("accessNode.api", accessNode);
};
