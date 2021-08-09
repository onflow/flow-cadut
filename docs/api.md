# Flow Cadence Utilities API Reference

## File System

### `readFile(path)`

Reads the contents fo the file as `utf8`. Syntax sugar for `fs.readFileSync(path, "utf8")`

#### Arguments

| Name   | Type   | Description      |
| ------ | ------ | ---------------- |
| `path` | string | path to the file |

#### Returns

| Type     | Description                            |
| -------- | -------------------------------------- |
| `string` | string representation of file contents |

#### Usage

```javascript
import { clearPath } from "flow-cadut";

const content = readFile("./log.cdc");
```

### `writeFile(path, data)`

| Name   | Type   | Description                                |
| ------ | ------ | ------------------------------------------ |
| `path` | string | path to file, where data should be written |
| `data` | string | data to write into file                    |

📣 If path to the file is nested and does not exist, method will create necessary folders to provide place to accommodate your file.

#### Usage

```javascript
import { writeFile } from "flow-cadut";

const script = `
  pub fun main(){
    log("Hello, Cadence")
  }
`;

writeFile("./cadence/scripts/log.cdc", script);
```

### `clearPath(path)`

Recursively delete contents of the provided folder and all it's contents. Syntax sugar for `fs.rmdirSync(path, { recursive: true })`

#### Arguments

| Name   | Type   | Description               |
| ------ | ------ | ------------------------- |
| `path` | string | path to folder to process |

#### Usage

```javascript
import { clearPath } from "flow-cadut";

clearPath("./ready-to-go");
```

### `getFileList(path)`

Returns list of paths to files on provided path

| Name   | Type   | Description               |
| ------ | ------ | ------------------------- |
| `path` | string | path to folder to process |

#### Returns

| Type     | Description                                                                     |
| -------- | ------------------------------------------------------------------------------- |
| [string] | array of strings, representing paths to files contained within specified folder |

#### Usage

```javascript
import { getFileList } from "flow-cadut";

const list = getFileList("./cadence");
```

## Imports

### `extractImports(code)`

#### Arguments

| Name   | Type   | Description           |
| ------ | ------ | --------------------- |
| `code` | string | Cadence template code |

#### Returns

| Type     | Description                                      |
| -------- | ------------------------------------------------ |
| `object` | contract name as key and import address as value |

#### Usage

```javascript
import { extractImports } from "flow-cadut";

const code = `
  import Message from 0x01
  import Utilities from 0x02
  
  pub fun main(){
    Utilities.log(Message.hello)
  }
`;
const imports = extractImports(code);

console.log(imports);
/*
 *  Line above shall show the following:
 *  {
 *     "Message": "0x01",
 *     "Utilities": "0x02"
 *   }
 * */
```

### `missingImports(code, addressMap)`

Given Cadence code template and addressMap, returns an array of missing contract imports

#### Arguments

| Name         | Type                      | Description                      |
| ------------ | ------------------------- | -------------------------------- |
| `code`       | string                    | Cadence template code            |
| `addressMap` | [AddressMap](#AddressMap) | addressMap for provided template |

#### Returns

| Type    | Description                                                   |
| ------- | ------------------------------------------------------------- |
| `array` | array strings, representing names of missing contract imports |

#### Usage

```javascript
import { missingImports } from "flow-cadut";

const code = `
  import Message from 0x01
  import Utilities from 0x02
  
  pub fun main(){
    Utilities.log(Message.hello)
  }
`;

const missing = missingImports(code, {});
console.log({ missing });
```

### `report(list, prefix)`

Reports missing imports via `console.error` with format:

```
[prefix] Missing Imports for contracts: [ Contract_1, Contract_2 ]
```

#### Arguments

| Name     | Type   | Optional | Description                      |
| -------- | ------ | -------- | -------------------------------- |
| `list`   | array  |          | list of missing contract imports |
| `prefix` | string | ✅       | Default: `""`                    |

#### Usage

```javascript
import { missingImports, report } from "flow-cadut";
const code = `
      import Message from 0x01
      
      pub fun main(){}
    `;
const list = missingImports(code, {});
report(list);
```

### `reportMissingImports(code, addressMap, prefix)`

Checks and reports missing contracts by matching code and addressMap in format:

```
[prefix] Missing Imports for contracts: [ Contract_1, Contract_2 ]
```

#### Arguments

| Name         | Type                      | Optional | Description                                      |
| ------------ | ------------------------- | -------- | ------------------------------------------------ |
| `code`       | string                    |          | Cadence template code to check                   |
| `addressMap` | [AddressMap](#AddressMap) | ✅       | addressMap for imported contracts. Default: `{}` |
| `prefix`     | string                    | ✅       | message prefix. Default: `""`                    |

#### Usage

```javascript
import { missingImports, report } from "flow-cadut";

const code = `
  import Message from 0x01
  
  pub fun main(){}
`;

reportMissingImports(code);
```

### `replaceImportAddresses(code, addressMap)`

Replaces import statements in provided Cadence templates with corresponding values from addressMap

#### Arguments

| Name         | Type                      | Description                                       |
| ------------ | ------------------------- | ------------------------------------------------- |
| `code`       | string                    | Cadence template code                             |
| `addressMap` | [AddressMap](#AddressMap) | AddressMap to use map contract names to addresses |

#### Returns

| Type   | Description                              |
| ------ | ---------------------------------------- |
| string | Updated template with replaced addresses |

#### Usage

```javascript
import { replaceImportAddresses } from "flow-cadut";

const code = `
  import Messages from 0x01
  
  pub fun main(){}
`;
const addressMap = {
  Message: "0xf8d6e0586b0a20c7",
};
const replaced = replaceImportAddresses(code, addressMap);
console.log({ replaced });
```

## Arguments

### `mapArgument(type, value)`

Converts provided value to `sdk` argument

#### Arguments

| Name    | Type   | Description                               |
| ------- | ------ | ----------------------------------------- |
| `type`  | string | Cadence type represented as string        |
| `value` | any    | correspondent value to use for conversion |

#### Returns

| Type                  | Description    |
| --------------------- | -------------- |
| [Argument](#Argument) | `sdk` argument |

#### Usage

```javascript
import { query, config } from "@onflow/fcl";
import { mapArgument } from "flow-cadut";

(async () => {
  config().put("accessNode.api", "https://access-testnet.onflow.org");

  const cadence = `
    pub fun main(message: String){
      log(message)
    }
`;

  const message = mapArgument("String", "Hello from Cadence!");

  const result = await query({
    cadence,
    args: () => [message],
  });

  console.log(result);
})();
```

### `mapValuesToCode(code, values)`

This method will extract argument types from provided Cadence code and then coverts
values to corresponding types, preparing them to be passed into `sdk.send`

📣 Best usage of this method is with combination of `query`/`mutate` methods from Javascript SDK.

#### Arguments

| Name     | Type   | Description                |
| -------- | ------ | -------------------------- |
| `code`   | string | Cadence template code      |
| `values` | array  | array of values to process |

#### Returns

| Type  | Description              |
| ----- | ------------------------ |
| array | array of `sdk` arguments |

#### Throws

This method will throw an error if user would fail to provide required amount of arguments

```javascript
import { query, config } from "@onflow/fcl";
import { mapValuesToCode } from "flow-cadut";

(async () => {
  config().put("accessNode.api", "https://access-testnet.onflow.org");

  const cadence = `
    pub fun main(metadata: {String:String}, key: String):String {
      return metadata[key]!
    }
`;

  const result = await query({
    cadence,
    args: () =>
      mapValuesToCode(cadence, [
        { language: "Flow", languageRating: "Cadence is Awesome 🤟" },
        "languageRating",
      ]),
  });

  console.log(result);
})();
```
