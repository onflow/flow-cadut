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

import {ec as EC} from "elliptic"
import {SHA3} from "sha3"
import * as fcl from "@onflow/fcl"
import {sansPrefix, withPrefix} from "./address"
const ec = new EC("p256")

const hashMsgHex = msgHex => {
  const sha = new SHA3(256)
  sha.update(Buffer.from(msgHex, "hex"))
  return sha.digest()
}

export const signWithKey = (privateKey, msgHex) => {
  const key = ec.keyFromPrivate(Buffer.from(privateKey, "hex"))
  const sig = key.sign(hashMsgHex(msgHex))
  const n = 32 // half of signature length?
  const r = sig.r.toArrayLike(Buffer, "be", n)
  const s = sig.s.toArrayLike(Buffer, "be", n)
  return Buffer.concat([r, s]).toString("hex")
}

export const authorization =
  (addr, pkey, keyId = 0) =>
  async (account = {}) => {
    addr = sansPrefix(addr)

    const signingFunction = async data => ({
      keyId,
      addr: withPrefix(addr),
      signature: signWithKey(pkey, data.message),
    })

    return {
      ...account,
      tempId: `${addr}-${keyId}`,
      addr: fcl.sansPrefix(addr),
      keyId,
      signingFunction,
    }
  }

export const REQUIRE_PRIVATE_KEY = "privateKey is required"
export const REQUIRE_ADDRESS = "address is required"
export const WARNING_KEY_INDEX = index =>
  `key index have incorrect format. found '${typeof index}', required 'num'`

export const processSigner = signer => {
  if (typeof signer === "object") {
    if (signer.privateKey === undefined) {
      throw Error(REQUIRE_PRIVATE_KEY)
    }
    if (signer.address === undefined) {
      throw Error(REQUIRE_ADDRESS)
    }
    if (signer.keyId === undefined) {
      console.warning(WARNING_KEY_INDEX(signer.keyId))
    }

    const {address, privateKey, keyId = 0} = signer
    return authorization(address, privateKey, keyId)
  }

  return signer
}
