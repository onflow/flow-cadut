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
    FlowToken: "0xee82856bf20e2aa6",
    FungibleToken: "0x0ae53cb6e3f42a79",
  },
  testnet: {
    FlowToken: "0x7e60df042a9c0868",
    FungibleToken: "0x9a0766d93b6608b7",
    LockedTokens: "0x95e019a17d0e23d7",
    StakingProxy: "0x7aad92e5a0715d21",
    FUSD: "0xe223d8a629e49c68"
  },
  mainnet: {
    FlowToken: "0x1654653399040a61",
    FungibleToken: "0xf233dcee88fe0abe",
    LockedTokens: "0x8d0e87b65159ae63",
    StakingProxy: "0x62430cf28c26d095",
    FUSD: "0x3c5959b568896393"
  },
};

export const ACCESS_NODES = {
  mainnet: "https://access-mainnet-beta.onflow.org",
  testnet: "https://access-testnet.onflow.org",
  emulator: "http://localhost:8080",
};

export const getEnvironment = async () => {
  const env = (await config().get("ix.env")) || "emulator";
  return DEPLOYED_CONTRACTS[env] || DEPLOYED_CONTRACTS.emulator;
};

export const setEnvironment = async (networkName = "emulator", options = {}) => {
  const network = networkName.toLowerCase();

  if (!DEPLOYED_CONTRACTS[network]) {
    throw new Error(
      `Provided value "${network}" is not supported. Try "emulator", "testnet" or "mainnet". Default: "emulator"`
    );
  }

  const { port, endpoint, limit } = options;
  const portBased =
    network === "emulator" && port ? `http://localhost:${port}` : ACCESS_NODES[network];
  const accessNode = endpoint || portBased;

  await config().put("ix.env", network);

  if(limit){
    await config().put("ix.executionLimit", limit);
  }

  await config().put("accessNode.api", accessNode);
};
