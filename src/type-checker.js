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

export const wrongType = (type) => !type || typeof type != "string";

export const isBasicNumType = (type) => {
  if (wrongType(type)) return false;
  return type.startsWith("Int") || type.startsWith("UInt") || type.startsWith("Word");
};

export const isFixedNumType = (type) => {
  if (wrongType(type)) return false;
  return type.startsWith("Fix64") || type.startsWith("UFix64");
};

export const isString = (type) => type === "String";
export const isCharacter = (type) => type === "Character";
export const isBoolean = (type) => type === "Bool";
export const isAddress = (type) => type === "Address" || type === "Address?";
export const isPath = (type) => type === "Path" || type === "Path?";

export const isBasicType = (type) => {
  if (wrongType(type)) return false;

  let fixedType = type.endsWith("?") ? type.slice(0, -1) : type;
  return (
    isBasicNumType(fixedType) ||
    isString(fixedType) ||
    isCharacter(fixedType) ||
    isBoolean(fixedType)
  );
};

export const isArray = (type) => {
  if (wrongType(type)) return false;

  const clearType = type.replace(/\s/g, "");
  return clearType.startsWith("[") && clearType.endsWith("]");
};

export const isDictionary = (type) => {
  if (wrongType(type)) return false;

  const clearType = type.replace(/\s/g, "");
  return clearType.startsWith("{") && clearType.endsWith("}");
};

export const isComplexType = (type) => isArray(type) || isDictionary(type);
