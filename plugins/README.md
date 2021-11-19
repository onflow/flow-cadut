# Plugin System

In order to provide better support and allow seamless integration to other libraries (i.e. FIND) we've added `Plugin System`.

Currently, supported plugin types are:

- `arguments`

# Development

You can create your own plugins - in most simple case it's an object with `id`, `type` and `resolver` function, which
transforms input and returns value in a specific format.

Below you can find specifications for different plugin types.

## Argument Resolver

Argument Resolve plugin is an object with tree fields:

| Name       | Type     | Description                                 |
| ---------- | -------- | ------------------------------------------- |
| `id`       | string   | Unique id prefixed with `cadut-`            |
| `type`     | string   | Plugin type. Should be equal to "argument"  |
| `resolver` | function | Function handling argument's transformation |

📣 `type` field should take value from `PLUGIN_TYPES` enum for compatibility’s sake

#### resolver(type, value)

| Name    | Type   | Description                           |
| ------- | ------ | ------------------------------------- |
| `type`  | string | String representation of Cadence type |
| `value` | any    | Corresponding value                   |

#### Returns

`resolver` shall return an object with two fields:

| Name    | Type   | Description                           |
| ------- | ------ | ------------------------------------- |
| `type`  | string | String representation of Cadence type |
| `value` | any    | Corresponding transformed value       |

📣 `type` _could_ be changed during transformation
📣 `value` should remain unchanged if plugin can't transform the value (for exampl if it doesn't match specific
validation criteria)

### Example

```javascript
import { PLUGIN_TYPES } from "flow-cadut";

const ArgumentLoggerPlugin = {
  id: "cadut-argument-logger",
  type: PLUGIN_TYPES.ARGUMENT,
  resolver: (type, value) => {
    // this plugin will output file type and it's value, then return them unchanged
    log(`${type} - ${JSON.stringify(value)}`);
    return { type, value };
  },
};
```
