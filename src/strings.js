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

export const capitalizeFirstLetter = (input) => {
  const [first] = input.split("");
  return first.toUpperCase() + input.slice(1);
};

export const underscoreToCamelCase = (text) => {
  return text
    .replace(/-/g, "_")
    .split("_")
    .map((word, i) => (i > 0 ? capitalizeFirstLetter(word) : word))
    .join("");
};

export const trimAndSplit = (input, trimWith, splitBy) => {
  if (splitBy) {
    return input.replace(trimWith, "").split(splitBy);
  }
  return input.replace(trimWith, "").split(getSplitCharacter(input));
};

export const getSplitCharacter = (input) => {
  switch (true) {
    case input.indexOf("//") >= 0:
      return "//";
    case input.indexOf("/") >= 0:
      return "/";
    case input.indexOf("\\") >= 0:
      return "\\";
    default:
      return "";
  }
};

export const collapseSpaces = (input) => input.replace(/\s+/g, " ");
export const stripNewLines = (input) => input.replace(/\r\n|\n|\r/g, " ");
