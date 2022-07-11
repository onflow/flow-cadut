---
"@onflow/flow-cadut": minor
---

**BREAKING** Bumped @onflow/fcl to 1.1.1-alpha.1

Developers should note that `[U]Int*` and `Word*` types are now decoded into strings by @onflow/fcl and no longer implicitly decoded into numbers.  This means that these types will need to be explicitly converted to JavaScript Number types if required.

This potentially affects the following flow-cadut features:

 - `sendTransaction` (where event data is `[U]Int*` or `Word*`)
 - `executeScript` (where return value is `[U]Int*` or `Word*`)
 - any generated script templates with `[U]Int*` or `Word*` return values
 - any generated transaction templates which emit `[U]Int*` or `Word*` event data

[See more here](https://github.com/onflow/fcl-js/blob/%40onflow/fcl%401.0.3-alpha.1/packages/sdk/CHANGELOG.md#100-alpha0)