# Flow Cadut Generator API Reference

## File System

### sansExtension(filename)

#### Arguments

| Name       | Type   | Description              |
| ---------- | ------ | ------------------------ |
| `filename` | string | file name with extension |

#### Returns

| Type   | Description                |
| ------ | -------------------------- |
| string | filename without extension |

#### Usage

```javascript
import { sansExtension } from "@onflow/flow-cadut";

const fileName = sansExtension("log-message-and-return.cdc");
console.log({ fileName });
```

📣 This method is used internally to get value for module name during code generation.

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
import { clearPath } from "@onflow/flow-cadut";

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
import { writeFile } from "@onflow/flow-cadut";

const script = `
  pub fun main(){
    log("Hello, Cadence")
  }
`;

writeFile("./cadence/scripts/log.cdc", script);
```

### `clearPath(path)`

Recursively deletes contents of the provided folder and all it's contents. Syntax sugar for `fs.rmdirSync(path, { recursive: true })`

#### Arguments

| Name   | Type   | Description               |
| ------ | ------ | ------------------------- |
| `path` | string | path to folder to process |

#### Usage

```javascript
import { clearPath } from "@onflow/flow-cadut";

clearPath("./ready-to-go");
```

### `getFileList(path)`

Recursively looking for files under `path` and returns list of paths to found items.

| Name   | Type   | Description               |
| ------ | ------ | ------------------------- |
| `path` | string | path to folder to process |

#### Returns

| Type     | Description                                                                     |
| -------- | ------------------------------------------------------------------------------- |
| [string] | array of strings, representing paths to files contained within specified folder |

#### Usage

```javascript
import { getFileList } from "@onflow/flow-cadut";

const list = getFileList("./cadence");
```

### `prettify(code, options)`

Prettifies `code` using Prettier and set of `options`.
Default `options` are:

```json
{
  "printWidth": 100,
  "endOfLine": "lf",
  "trailingComma": "es5",
  "tabWidth": 2,
  "semi": true,
  "useTabs": false,
  "singleQuote": false
}
```

#### Arguments

| Name      | Type   | Optional | Description                                                                                                         |
| --------- | ------ | -------- | ------------------------------------------------------------------------------------------------------------------- |
| `code`    | string |          | valid Javascript code                                                                                               |
| `options` | object | ✅       | Prettier options. Consult [Prettier Options Documentation](https://prettier.io/docs/en/options.html) to learn more. |

#### Returns

| Type   | Description                         |
| ------ | ----------------------------------- |
| string | prettified version of provided code |

#### Usage

```javascript
import { prettify } from "@onflow/flow-cadut";

const code = `
  const a         = "Hello"
  const b    = "World
  console.log(a    +b);
`;

const pretty = prettify(code);
console.log(pretty);
```