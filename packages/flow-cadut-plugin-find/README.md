# FIND Address Resolver Plugin

This package provides plugin for FIND address resolver.

## Installation

The FIND plugin exists within the `@onflow/flow-cadut-plugin-find` package which is consumed by the `@onflow/flow-cadut` package.

To install `@onflow/flow-cadut` and `@onflow/flow-cadut-plugin-find`, call the following:

```shell
npm run install @onflow/flow-cadut @onflow/flow-cadut-plugin-find
```

or

```shell
yarn add @onflow/flow-cadut @onflow/flow-cadut-plugin-find
```

## Usage

FIND plugin is dependent on value of current environment, so you will need to set it first with `setEnvironment` method.
Then register plugin with `registerPlugin` from `@onflow/flow-cadut` package

```javascript
import { executeScript, setEnvironment, registerPlugin } from "@onflow/flow-cadut";
import { FIND } from "@onflow/flow-cadut-plugin-find";

(async () => {
  await setEnvironment("testnet");
  await registerPlugin(FIND);

  // Let's create some basic Cadence script, which will accept Address argument and return it's value
  const code = `
    pub fun main(addressBook: [Address]): [Address]{
      return address
    }
  `;
  const args = [
    // FIND address can be in prefixed "find:name"
    "find:bjarte",
    // or suffixed "name.find" form
    "bjarte.find",
  ];
  const [bjarte, err] = await executeScript({ code, args });
  if (!err) {
    console.log({ bjarte });
  }
})();
```
