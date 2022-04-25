import { decode, getBlock, send } from "@onflow/fcl";

export const getLatestBlock = async () => {
  return send([
    getBlock(true), // isSealed = true
  ]).then(decode);
};

export const getChainHeight = async () => {
  const topBlock = await getLatestBlock();
  return topBlock.height;
};
