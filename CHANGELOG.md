# @onflow/flow-cadut

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
