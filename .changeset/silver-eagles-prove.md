---
"@onflow/flow-cadut": minor
---

**BREAKING** @onflow/flow-cadut has been converted to a monorepo and partitioned into the following packages:

 - `@onflow/flow-cadut`
 - `@onflow/flow-cadut-generator` (previously `@onflow/flow-cadut/generator`)
 - `@onflow/flow-cadut-plugin-find` (previously `@onflow/flow-cadut/plugins/find`)
 - `@onflow/flow-cadut-plugin-flowns` (previously `@onflow/flow-cadut/plugins/flowns`)
 - `@onflow/flow-cadut-views` (previously `@onflow/flow-cadut/views`)

*Note* - The `@onflow/flow-cadut` generator CLI has also been moved to `@onflow/flow-cadut-generator`.

In order to use the `flow-generate` command, you must install the generator package via:

```bash
npm install -D @onflow/flow-cadut-generator
```

The generator command may now be used via `npx flow-generate` on the command line.  See complete installation instructions [here](/README.md#installation).