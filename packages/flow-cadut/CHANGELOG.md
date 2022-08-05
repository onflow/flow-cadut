# @onflow/flow-cadut

## 0.2.0-alpha.8

### Major Changes

- [#102](https://github.com/onflow/flow-cadut/pull/102) [`477d3df`](https://github.com/onflow/flow-cadut/commit/477d3dfd6cad51de9a15a978e5adfcea9b128e80) Thanks [@jribbink](https://github.com/jribbink)! - **BREAKING** Bumped @onflow/fcl to 1.1.1-alpha.1

  Developers should note that `[U]Int*` and `Word*` types are now decoded into strings by @onflow/fcl and no longer implicitly decoded into numbers. This means that these types will need to be explicitly converted to JavaScript Number types if required.

  This potentially affects the following flow-cadut features:

  - `sendTransaction` (where event data is `[U]Int*` or `Word*`)
  - `executeScript` (where return value is `[U]Int*` or `Word*`)
  - any generated script templates with `[U]Int*` or `Word*` return values
  - any generated transaction templates which emit `[U]Int*` or `Word*` event data

  [See more here](https://github.com/onflow/fcl-js/blob/%40onflow/fcl%401.0.3-alpha.1/packages/sdk/CHANGELOG.md#100-alpha0)

  Additionally, passing in Number as value for Int is deprecated and will cease to work in future releases of @onflow/types. Going forward, use String as value for Int.

  This could potentially affect the following functions in the future:

  - `sendTransaction` (where integer arguments are passed)
  - `executeScript` (where integer arguments are passed)
  - any generated script templates with integer arguments passed
  - any generated transaction templates with integer arguments passed

  You can learn more (including a guide on common transition paths) [here](https://github.com/onflow/flow-js-sdk/blob/master/packages/types/WARNINGS.md#0002-[U]Int*-and-Word*-as-Number).

* [#104](https://github.com/onflow/flow-cadut/pull/104) [`c5d3a23`](https://github.com/onflow/flow-cadut/commit/c5d3a2370034ff6ee6b965d9b261d4547f9ad92f) Thanks [@jribbink](https://github.com/jribbink)! - **BREAKING** `@onflow/flow-cadut` has been converted to a monorepo and partitioned into the following packages:

  - `@onflow/flow-cadut`
  - `@onflow/flow-cadut-generator` (previously `@onflow/flow-cadut/generator`)
  - `@onflow/flow-cadut-plugin-find` (previously `@onflow/flow-cadut/plugins/find`)
  - `@onflow/flow-cadut-plugin-flowns` (previously `@onflow/flow-cadut/plugins/flowns`)
  - `@onflow/flow-cadut-views` (previously `@onflow/flow-cadut/views`)

  _Note_ - The `@onflow/flow-cadut` generator CLI has also been moved to `@onflow/flow-cadut-generator`.

  In order to use the `flow-generate` command, you must install the generator package via:

  ```bash
  npm install -D @onflow/flow-cadut-generator
  ```

  The generator command may now be used via `npx flow-generate` on the command line. See complete installation instructions [here](/README.md#installation).

### Patch Changes

- [#97](https://github.com/onflow/flow-cadut/pull/97) [`7a09ae7`](https://github.com/onflow/flow-cadut/commit/7a09ae7f63e33b7fc84d6abe6a86cfa30b13d37f) Thanks [@MaxStalker](https://github.com/MaxStalker)! - Fix contract parser to properly process contracts, which implements some interface

* [#107](https://github.com/onflow/flow-cadut/pull/107) [`663f0fc`](https://github.com/onflow/flow-cadut/commit/663f0fc04194b5d40ed15523d9daa585256f00a2) Thanks [@jribbink](https://github.com/jribbink)! - Verify that provided domain is valid for provided argument type when mapping path arguments

- [#113](https://github.com/onflow/flow-cadut/pull/113) [`8315ee1`](https://github.com/onflow/flow-cadut/commit/8315ee156520bde2b46a78cd77bd5488106665cd) Thanks [@jribbink](https://github.com/jribbink)! - Adds support for optional complex types
