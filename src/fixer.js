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

export const sansPrefix = (address) => {
  if (address == null) return null;
  return address.replace(/^0x/, "");
};

export const withPrefix = (address) => {
  if (address == null) return null;
  return "0x" + sansPrefix(address);
};

export const padAddress = (address) => {
  return "0x" + sansPrefix(address).padStart(16, "0");
};

export const toFixedValue = (val) => parseFloat(val).toFixed(8);

export const domains = ["public", "private", "storage"];

export const parsePath = (path) => {
  if (path.startsWith("/")) {
    const parts = path.slice(1).split("/");
    if (parts.length !== 2) {
      throw Error("Incorrect Path - identifier missing");
    }
    if (!domains.includes(parts[0])){
      throw Error("Incorrect Path - wrong domain")
    }
    const [domain, identifier] = parts;
    return { domain, identifier };
  }
  throw Error("Incorrect Path - shall start with `/`");
};
