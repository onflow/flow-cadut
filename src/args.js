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

import * as t from "@onflow/types";
import * as fcl from "@onflow/fcl";

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

const throwTypeError = (msg) => {
  throw new Error("Type Error: " + msg)
}

export const argType = (pair) => {
  const [_, type] = pair.split(":");
  return type;
};

// Type Checker
const isBasicNumType = (type) => {
  return type.startsWith("Int") || type.startsWith("UInt") || type.startsWith("Word");
};

const isFixedNumType = (type) => {
  return type.startsWith("Fix64") || type.startsWith("UFix64");
};

const isString = (type) => type === "String";
const isCharacter = (type) => type === "Character";
const isBoolean = (type) => type === "Bool";
const isAddress = (type) => type === "Address";

const isBasicType = (type) =>
  isBasicNumType(type) || isString(type) || isCharacter(type) || isBoolean(type);

const isArray = (type) => {
  const clearType = type.replace(/\s/g, "");
  const result = clearType.startsWith("[") && clearType.endsWith("]");
  return result;
};

const isDictionary = (type) => {
  const clearType = type.replace(/\s/g, "");
  return clearType.startsWith("{") && clearType.endsWith("}");
};

const isComplexType = (type) => isArray(type) || isDictionary(type);

const getDictionaryTypes = (type) => type.replace(/[\s{}]/g, "").split(":");
const getArrayType = (type) => type.replace(/[\s\[\]]/g, "");

export const mapArgument = (type, value) => {
  switch (true) {
    case isBasicType(type): {
      const result = fcl.arg(value, t[type]);
      return result;
    }

    case isFixedNumType(type): {
      // Try to parse value and throw if it fails
      if (isNaN(parseFloat(value))) {
        throwTypeError("Expected proper value for fixed type");
      }
      return fcl.arg(toFixedValue(value), t[type]);
    }

    case isAddress(type): {
      return fcl.arg(withPrefix(value), t[type]);
    }

    case isArray(type): {
      const arrayType = getArrayType(type);

      if (isComplexType(arrayType)) {
        return fcl.arg(
          value.map((v) => mapArgument(arrayType, v)),
          t.Array(t[arrayType])
        );
      }

      return fcl.arg(value, t.Array(t[arrayType]));
    }

    case isDictionary(type): {
      const [keyType, valueType] = getDictionaryTypes(type);
      const finalValue = [];
      for (let key in value) {
        if (value.hasOwnProperty(key)) {
          let resolvedValue;
          if (isComplexType(valueType)) {
            resolvedValue = mapArgument(valueType, value[key]);
          } else {
            resolvedValue = value[key];
          }

          finalValue.push({
            key,
            value: resolvedValue,
          });
        }
      }
      return fcl.arg(finalValue, t.Dictionary({ key: t[keyType], value: t[valueType] }));
    }

    default: {
      throw `${type} is not supported`;
    }
  }
};

export const assertType = (arg) => arg.xform.asArgument(arg.value);

export const mapArguments = (schema = [], values) => {
  if (values.length < schema.length) {
    throw new Error("Not enough arguments");
  }
  return values.map((value, i) => {
    const mapped = mapArgument(schema[i], value);
    assertType(mapped);
    return mapped;
  });
};
