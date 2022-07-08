# FIND Address Resolver Plugin

This package provides plugin for FIND address resolver.

## Installation

FIND package goes pre-bundled together with other plugins from `@onflow/flow-cadut` package.
If you have `@onflow/flow-cadut` installed - you can use it right away.
Otherwise call

```shell
npm run install @onflow/flow-cadut
```

or

```shell
yarn add @onflow/flow-cadut
```

## Usage

FIND plugin is dependent on value of current environment, so you will need to set it first with `setEnvironment` method.
Then register plugin with `registerPlugin` from `@onflow/flow-cadut` package

```javascript
import { executeScript, setEnvironment, registerPlugin } from "@onflow/flow-cadut";
import { FIND } from "@onflow/flow-cadut/plugins/FIND";

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
