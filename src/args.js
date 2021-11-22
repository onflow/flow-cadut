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

import { parsePath, toFixedValue, withPrefix } from "./fixer";
import { getTemplateInfo } from "./parser";
import {
  isBasicType,
  isFixedNumType,
  isAddress,
  isPath,
  isArray,
  isDictionary,
  isComplexType,
  wrongType,
  isBasicNumType,
} from "./type-checker";

import { removeSpaces } from "./strings";
import { getPlugins, applyPlugins, PLUGIN_TYPES } from "./plugins";

const throwTypeError = (msg) => {
  throw new Error("Type Error: " + msg);
};

export const splitArgs = (pair) => {
  return pair
    .split(/(\w+)\s*:\s*([\w{}[\]:\s?]*)/)
    .filter((item) => item !== "")
    .map((item) => item.replace(/\s*/g, ""));
};

export const argType = (pair) => splitArgs(pair)[1];

export const getDictionaryTypes = (type) => {
  const match = /{(.*)}/.exec(type);
  return match[1]
    .split(/([^:]*):(.*)/)
    .map((item) => item.replace(/\s/g, ""))
    .filter((item) => item);
};

export const getArrayType = (type) => {
  const match = /\[(.*)\]/.exec(type);
  return removeSpaces(match[1]);
};

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
  if (required !== found) {
    const errorMessage = `Incorrect number of ${itemType}: found ${found} of ${required}`;
    const message = prefix ? `${prefix} ${errorMessage}` : errorMessage;
    console.error(message);
  }
};

export const raw = (type) => type.slice(0, -1);

export const resolveBasicType = (type) => {
  if (wrongType(type)) return false;

  if (type.includes("?")) {
    return t.Optional(t[raw(type)]);
  }
  return t[type];
};

export const resolveType = (type) => {
  if (isComplexType(type)) {
    switch (true) {
      case isArray(type): {
        const arrayType = getArrayType(type);
        return t.Array(resolveType(arrayType));
      }

      case isDictionary(type): {
        const [key, value] = getDictionaryTypes(type);
        const dictionaryType = { key: resolveType(key), value: resolveType(value) };
        return t.Dictionary(dictionaryType);
      }

      default: {
        return resolveBasicType(type);
      }
    }
  }
  return resolveBasicType(type);
};

/**
 * Map single argument to fcl.arg representation.
 * @param {string} rawType - Cadence value type
 * @param {any} rawValue - actual value
 * @returns any - mapped fcl.arg value
 */
export const mapArgument = async (rawType, rawValue) => {
  const plugins = await getPlugins(PLUGIN_TYPES.ARGUMENT);

  let value = rawValue;
  let type = rawType;

  if (plugins) {
    let applied = await applyPlugins({ type: rawType, value: rawValue }, plugins);
    value = applied.value;
    type = applied.type;
  }

  const resolvedType = resolveType(type);

  switch (true) {
    case isBasicType(type): {
      return fcl.arg(value, resolvedType);
    }

    case isFixedNumType(type): {
      // Try to parse value and throw if it fails
      if (value === null) {
        return fcl.arg(null, resolvedType);
      }
      if (isNaN(parseFloat(value))) {
        throwTypeError("Expected proper value for fixed type");
      }
      return fcl.arg(toFixedValue(value), resolvedType);
    }

    case isAddress(type): {
      const prefixedAddress = withPrefix(value);
      return fcl.arg(prefixedAddress, resolvedType);
    }

    case isPath(type): {
      return fcl.arg(
        parsePath(value),
        resolvedType
      );
    }

    case isArray(type): {
      const arrayType = getArrayType(type);

      if (isComplexType(arrayType)) {
        const mappedValue = await Promise.all(
          value.map(async (v) => {
            const { value } = await mapArgument(arrayType, v);
            return value;
          })
        );
        return fcl.arg(mappedValue, resolvedType);
      }

      const result = fcl.arg(value, resolvedType);
      return result;
    }

    case isDictionary(type): {
      const [keyType, valueType] = getDictionaryTypes(type);
      const finalValue = [];
      const keys = Object.keys(value);

      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        let resolvedValue;
        if (isComplexType(valueType)) {
          resolvedValue = (await mapArgument(valueType, value[key])).value;
        } else {
          resolvedValue = value[key];
        }

        const fixedKey = isBasicNumType(keyType) ? parseInt(key) : key;

        finalValue.push({
          key: fixedKey,
          value: resolvedValue,
        });
      }

      const result = fcl.arg(finalValue, resolvedType);
      return result;
    }

    default: {
      throw `${type} is not supported`;
    }
  }
};

export const assertType = (arg) => {
  return arg.xform.asArgument(arg.value);
};

/**
 * Map arguments with provided schema.
 * @param {[string]} schema - array of Cadence value types
 * @param {[any]} values - array of passed values
 * @returns [any] - array of mapped fcl.arg values
 */
export const mapArguments = async (schema = [], values) => {
  if (schema.length > values.length) {
    throw new Error("Not enough arguments");
  }
  return Promise.all(
    values.map(async (value, i) => {
      const mapped = await mapArgument(schema[i], value);
      assertType(mapped);
      return mapped;
    })
  );
};

/**
 * Map arguments via Cadence template.
 * @param {string} code - Cadence template
 * @param {[any]} values - array of values
 * @returns [any] - array of mapped fcl.arg
 */
export const mapValuesToCode = async (code, values = []) => {
  const schema = getTemplateInfo(code).args.map(argType);
  return mapArguments(schema, values);
};

export const unwrap = (arr, convert) => {
  const type = arr[arr.length - 1];
  return arr.slice(0, -1).map((value) => convert(value, type));
};

const rawArgs = (args) => {
  return args.reduce((acc, arg) => {
    const unwrapped = unwrap(arg, (value, type) => {
      return fcl.arg(value, type);
    });
    acc = [...acc, ...unwrapped];
    return acc;
  }, []);
};

export const resolveArguments = async (args, code) => {
  if (args.length === 0) {
    return [];
  }

  // We can check first element in array. If it's last value is instance
  // of @onflow/types then we assume that the rest of them are also unprocessed
  const first = args[0];
  if (Array.isArray(first) && first.length > 0) {
    const last = first[first.length - 1];
    if (last.asArgument) {
      return rawArgs(args);
    }
  }
  // Otherwise we process them and try to match them against the code
  return mapValuesToCode(code, args);
};
