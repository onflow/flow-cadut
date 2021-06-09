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
import { getTemplateInfo } from "./parser";
import {
  isBasicType,
  isFixedNumType,
  isAddress,
  isArray,
  isDictionary,
  isComplexType,
} from "./type-checker";


const throwTypeError = (msg) => {
  throw new Error("Type Error: " + msg);
};

export const argType = (pair) => pair.split(":")[1];

export const getDictionaryTypes = (type) => type.replace(/[\s{}]/g, "").split(":");
export const getArrayType = (type) => type.replace(/[\s[\]]/g, "");

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

/**
 * Map single argument to fcl.arg representation.
 * @param {string} type - Cadence value type
 * @param {any} value - actual value
 * @returns any - mapped fcl.arg value
 */
export const mapArgument = (type, value) => {
  switch (true) {
    case isBasicType(type): {
      return fcl.arg(value, t[type]);
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
      const keys = Object.keys(value);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
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
      return fcl.arg(finalValue, t.Dictionary({ key: t[keyType], value: t[valueType] }));
    }

    default: {
      throw `${type} is not supported`;
    }
  }
};

export const assertType = (arg) => arg.xform.asArgument(arg.value);

/**
 * Map arguments with provided schema.
 * @param {[string]} schema - array of Cadence value types
 * @param {[any]} values - array of passed values
 * @returns [any] - array of mapped fcl.arg values
 */
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

/**
 * Map arguments via Cadence template.
 * @param {[string]} code - Cadence template
 * @param {[any]} values - array of values
 * @returns [any] - array of mapped fcl.arg
 */
export const mapValuesToCode = (code, values = []) => {
  const schema = getTemplateInfo(code).args.map(argType);
  return mapArguments(schema, values);
};
