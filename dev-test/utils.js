import { ec as EC } from "elliptic";
import * as fcl from "@onflow/fcl";
import { config, sansPrefix, send, tx, withPrefix } from "@onflow/fcl";
import { SHA3 } from "sha3";
import { mapValuesToCode } from "../src";
const ec = new EC("p256");

const hashMsgHex = (msgHex) => {
  const sha = new SHA3(256);
  sha.update(Buffer.from(msgHex, "hex"));
  return sha.digest();
};

export const signWithKey = (privateKey, msgHex) => {
  const key = ec.keyFromPrivate(Buffer.from(privateKey, "hex"));
  const sig = key.sign(hashMsgHex(msgHex));
  const n = 32; // half of signature length?
  const r = sig.r.toArrayLike(Buffer, "be", n);
  const s = sig.s.toArrayLike(Buffer, "be", n);
  return Buffer.concat([r, s]).toString("hex");
};

export const authorization =
  (addr, keyId = 0) =>
  async (account = {}) => {
    const serviceAddress = await config().get("SERVICE_ADDRESS");
    const pkey = await config().get("PRIVATE_KEY");

    addr = sansPrefix(addr || serviceAddress);

    const signingFunction = async (data) => ({
      keyId,
      addr: withPrefix(addr),
      signature: signWithKey(pkey, data.message),
    });

    return {
      ...account,
      tempId: `${addr}-${keyId}`,
      addr: sansPrefix(addr),
      keyId,
      signingFunction,
    };
  };

export const mutate = async (props) => {
  const { cadence, payer = authorization(), args, limit = 100 } = props;
  const values = await mapValuesToCode(cadence, args)
  const response = await send([
    fcl.transaction(cadence),
    fcl.args(values),
    fcl.proposer(payer),
    fcl.payer(payer),
    fcl.authorizations([payer]),
    fcl.limit(limit),
  ]);

  return tx(response).onceExecuted(true);
};
