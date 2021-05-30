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
