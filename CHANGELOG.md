# @onflow/flow-cadut

## 0.2.0-alpha.8

### Minor Changes

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

### Patch Changes

- [#97](https://github.com/onflow/flow-cadut/pull/97) [`7a09ae7`](https://github.com/onflow/flow-cadut/commit/7a09ae7f63e33b7fc84d6abe6a86cfa30b13d37f) Thanks [@MaxStalker](https://github.com/MaxStalker)! - Fix contract parser to properly process contracts, which implements some interface

## 0.2.0-alpha.7

### Patch Changes

- [#95](https://github.com/onflow/flow-cadut/pull/95) [`972b96a`](https://github.com/onflow/flow-cadut/commit/972b96a8b51691215585f011c79d05fd1feff11c) Thanks [@jribbink](https://github.com/jribbink)! - Remove residual references to flow-cadut and replace with @onflow/flow-cadut

## 0.2.0-alpha.6

### Minor Changes

- [#66](https://github.com/onflow/flow-cadut/pull/66) [`c901f5a`](https://github.com/onflow/flow-cadut/commit/c901f5a970ab09f501c717317a8ec933df0d93fe) Thanks [@hotrungnhan](https://github.com/hotrungnhan)! - Add support for PublicPath/StoragePath/PrivatePath/CapabilityPath arguments

## 0.1.16-alpha.5

### Patch Changes

- 7c5ee7d: Strip strings from templates in parser to prevent bugs related to cadence keywords existing in strings

## 0.1.16-alpha.4

### Patch Changes

- bbad20a: Introduce changesets

## 0.1.15 - 2021-12-20

- Added views for Flovatar and Versus

## 0.1.14 - 2021-11-23

- Bump @onflow/fcl and @onflow/types to latest versions
- Added Path argument resolver
- Fixed issue with complex arguments due to new async nature of `mapValuesToCode` method
- Updated tests

## 0.1.13 - 2021-11-20

- Added Flowns address resolver plugin

## 0.1.12 - 2021-11-19

- Added Plugin System
- Added FIND address resolver plugin

## 0.1.11 - 2021-10-11

- More fixes to complex argument resolver
- Bundle esm into main package

## 0.1.10 - 2021-10-08

- Improved interactions - return raw values and wait for specific transaction status
- Fix argument resolver

## 0.1.9 - 2021-09-23

- Add parser logic for extracting contract arguments
- Fix argument resolver for complex types
- Extract server side logic into separate file for proper tree shaking

## 0.1.8 - 2021-09-22

- Fixed parser issue, when extra spaces are present in argument definition

## 0.1.7 - 2021-09-20

- Added support for Optionals
- Added support for multi-line arguments

## 0.1.6 - 2021-07-26

- Fixed support for nested arrays
- Improved support for complex types
- Improved test coverage

## 0.1.5 - 2021-06-27

- Removed `flow-js-testing` dependency
- Refactored code generation for all types of interactions
- Added support for contract templates
- Added tests for main functionality
- Updated `flow-generate` CLI. Added GitHub support and flags.

## 0.1.4 - 2021-06-11

- Updated regexp matchers to properly catch script and transaction arguments

## 0.1.3 - 2021-06-10

- Exported mapArgument, mapArguments and mapValuesToCode methods.

## 0.1.2 -- 2021-06-02

- Regenerated templates to remove unused import, which would trigger linter.

## 0.1.1 -- 2021-06-02

- Regenerated templates to import `flow-cadut`.

### 0.1.0 -- 2021-06-02

- First release.
