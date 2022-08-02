# FLOWNS Address Resolver Plugin

This package provides plugin for FLOWNS address resolver.

## Overview

[Flowns](https://www.flowns.org/) is a new generation of decentralized domain name service built on Flow network. It is a resource-oriented domain name service based on Cadence smart contract language. The Resource model in Flow makes the Flowns service flexible and extensible, and based on the domain name NFT asset, we can generate more usage scenarios.

Flowns is not only a domain service, but also a protocol for opening identities and assets in digital world.

See [more here](https://www.flowns.org/).

## Installation

The FLOWNS plugin exists within the `@onflow/flow-cadut-plugin-flowns` package which is consumed by the `@onflow/flow-cadut` package.

To install `@onflow/flow-cadut` and `@onflow/flow-cadut-plugin-flowns`, call the following:

```shell
npm run install @onflow/flow-cadut @onflow/flow-cadut-plugin-flowns
```

or

```shell
yarn add @onflow/flow-cadut @onflow/flow-cadut-plugin-flowns
```

## Usage

FIND plugin is dependent on value of current environment, so you will need to set it first with `setEnvironment` method.
Then register plugin with `registerPlugin` from `@onflow/flow-cadut` package

```javascript
import { executeScript, setEnvironment, registerPlugin } from "@onflow/flow-cadut";
import { FLOWNS } from "@onflow/flow-cadut-plugin-flowns";

(async () => {
  await setEnvironment("testnet");
  await registerPlugin(FLOWNS);

  // Let's create some basic Cadence script, which will accept Address argument and return it's value
  const code = `
    pub fun main(addressBook: [Address]): [Address]{
      return address
    }
  `;
  const args = [
    // FLOWNS address
    "flowns.fn"
  ];
  const [flowns, err] = await executeScript({ code, args });
  if (!err) {
    console.log({ flowns });
  }
})();
```
