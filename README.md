# Flow Cadence Template Utilities
Working with Cadence template files can be a bit frustrating.
We aim to simplify this process by providing you an easy way to generate supporting files, which are easy to use. 

You can find a list of available methods with examples at [API Documentation](/docs/api.md)

# Cadence Template Generator
Additionally, in this package we have bundled template generator, which takes either path to a local folder or url to 
Github repository and generates a code to conveniently grab Cadence template or send specific interaction to network.

## Usage
### Local Folder
```
# long flags
flow-generate --input ./cadence --output ./src/generated

# short flags
flow-generate -i ./cadence -o ./src/generated

# no flags
flow-generate ./cadence ./src/generated
```

### GitHub Repository
For GitHub repositories you can specify branch you want to pull with `--branch` or `-b` flags. If you omit it, then generator
will default to `master/main` branch.
```
# long flags
flow-generate --input https://github.com/onflow/flow-core-contracts --branch feature/epochs --output ./src/generated

# short flags
flow-generate -i https://github.com/onflow/flow-core-contracts - b feature/epochs -o ./src/generated

# no flags
flow-generate https://github.com/onflow/flow-core-contracts feature/epochs ./src/generated

# no flags, main branch
flow-generate https://github.com/onflow/flow-core-contracts ./src/generated
```
#### Process Single Folder (recursively)
You can also paste full path to specific folder that you want to process. For example:
```
flow-generate https://github.com/onflow/flow-core-contracts/tree/master/contracts ./src/generated
```
In this specific case, generator would assume that you want to process `contracts` folder in the root of repository.

For a slightly more complex case - using Git Flow approach for example - please, specify branch name, so generator can 
extract folder name properly.
```
flow-generate https://github.com/onflow/flow-core-contracts/tree/feature/epochs/transactions/flowToken feature/epochs ./src/generated
```
