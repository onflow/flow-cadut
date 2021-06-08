/*
 * Flow Template Utilities
 *
 * Copyright 2021 Dapper Labs, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as types from "@onflow/types";
import { toFixedValue, withPrefix } from "./fixer";

/**
 * Reports missing arguments.
 * @param {number} found - number of arguments passed into method
 * @param {number} required - number of arguments required to execute the code
 * @param {string} prefix - error message prefix
 */
export const reportArguments = (found, required, prefix = "") => {
  if (required > found) {
    const errorMessage = `Incorrect number of arguments: found ${found} of ${required}`;
    const message = prefix ? `${prefix} ${errorMessage}` : errorMessage;
    console.error(message);
  }
};

/**
 * Reports missing items.
 * @param {string} itemType - name of the missing item
 * @param {number} found - number of arguments passed into method
 * @param {number} required - number of arguments required to execute the code
 * @param {string} prefix - error message prefix
 */
export const reportMissing = (itemType = "items", found, required, prefix = "") => {
  if (required > found) {
    const errorMessage = `Incorrect number of ${itemType}: found ${found} of ${required}`;
    const message = prefix ? `${prefix} ${errorMessage}` : errorMessage;
    console.error(message);
  }
};

export const argType = (pair) => {
  const [_, type] = pair.split(":");
  return type;
};

// Type Checker
const isBasicNumType = (type) => {
  return type.includes("Int") || type.includes("Word");
};

const isFixedNumType = (type) => {
  return type.includes("Fix64");
};

const isBoolean = (type) => type;

const isArray = (type) => {
  const clearType = type.replace(/\s/g, "");
  return clearType.startsWith("[") && clearType.endsWith("]");
};

const isDictionary = (type) => {
  const clearType = type.replace(/\s/g, "");
  return clearType.startsWith("{") && clearType.endsWith("}");
};

const getDictionaryTypes = (type) => type.replace(/[\s{}]/g, "").split(":");

export const mapArgument = (type, value) => {
  // TODO: add some validation, when wrong type is presented
  switch (true) {
    case isBasicNumType(type): {
      return {
        type: types[type],
        value,
      };
    }

    case isFixedNumType(type): {
      return {
        type: types[type],
        value: toFixedValue(value),
      };
    }

    case type === "String" || type === "Character": {
      return { type: types[type], value };
    }

    case type === "Address": {
      return {
        type: types.Address,
        value: withPrefix(value),
      };
    }

    case type === "Bool": {
      return {
        type: types.Bool,
        value,
      };
    }

    // TODO: Fix this case
    case isArray(type): {
      const arrayType = types.Array(types[type]);
      return {
        type: arrayType,
        value,
      };
    }

    case isDictionary(type): {
      const [keyType, valueType] = getDictionaryTypes(type);
      const finalValue = [];
      for (let key in value) {
        console.log(key, value[key])
        if (value.hasOwnProperty(key)) {
          finalValue.push({
            key,
            value: mapArgument(valueType, value[key]),
          });
        }
      }
      return {
        type: types.Dictionary({ key: keyType, value: valueType }),
        value: finalValue,
      };
    }
  }
};

export const mapArguments = (schema = [], values) => {
  return schema.map((type, i) => {
    return mapArgument(type, values[i]);
  });
};
