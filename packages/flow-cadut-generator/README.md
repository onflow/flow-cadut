# Flow Cadence Template Generator: Flow Cadut Generator

Flow Cadut supports Cadence interaction by wrapping template files in Javascript.

The Flow Cadence Template Generator (`@onflow/flow-cadut-generator`) is responsible for parsing Cadence (.cdc) template files and translating them to easy-to-use JavaScript (.js) files. The Cadence Template Generator, takes either path to a local folder or url to a Github repository and generates JavaScript files which wrap the Cadence code and facilitate sending the templated interactions to the Flow network.

## Usage

### Installation

In order to install the Flow Cadence Template Generator CLI, run the following command to add it to your project's `devDependencies`:

```bash
npm install -D @onflow/flow-cadut-generator
```

Note that any generated code will require `@onflow/flow-cadut` as a dependency which can be installed by running the following command in your project root:

```bash
npm install @onflow/flow-cadut
```

### CLI options
```
flow-generate [input] [output]

Generate corresponding JavaScript files from a cadence input folder

Options:
      --help        Show help                                          [boolean]
      --version     Show version number                                [boolean]
  -i, --input       Cadence input directory or Github repository URL
                                                 [string] [default: "./cadence"]
  -o, --output      Javascript output directory
                                           [string] [default: "./src/generated"]
  -b, --branch      Git branch to use if git repository used as input   [string]
  -d, --dependency  Dependency to use in generated templates
                                        [string] [default: "@onflow/flow-cadut"]
  -w, --watch       Whether to run the generator as a standalone build or in
                    watch mode                        [boolean] [default: false]
```

### Local Folder
```
# long flags
npx flow-generate --input ./cadence --output ./src/generated

# short flags
npx flow-generate -i ./cadence -o ./src/generated

# no flags
npx flow-generate ./cadence ./src/generated
```

### GitHub Repository
For GitHub repositories you can specify branch you want to pull with `--branch` or `-b` flags. If you omit it, then generator
will default to `master/main` branch.
```
# long flags
npx flow-generate --input https://github.com/onflow/flow-core-contracts --branch feature/epochs --output ./src/generated

# short flags
npx flow-generate -i https://github.com/onflow/flow-core-contracts -b feature/epochs -o ./src/generated

# positional arguments
npx flow-generate https://github.com/onflow/flow-core-contracts ./src/generated -b feature/epochs

# positional arguments, main branch
npx flow-generate https://github.com/onflow/flow-core-contracts ./src/generated
```
#### Process Single Folder (recursively)
You can also paste full path to specific folder that you want to process. For example:
```
npx flow-generate https://github.com/onflow/flow-core-contracts/tree/master/contracts ./src/generated
```
In this specific case, generator would assume that you want to process `contracts` folder in the root of repository.

For a slightly more complex case - using Git Flow approach for example - please, specify branch name, so generator can 
extract folder name properly.
```
npx flow-generate https://github.com/onflow/flow-core-contracts/tree/feature/epochs/transactions/flowToken ./src/generated -b feature/epochs
```
