import { query } from "../../../src";
import { CODE as getNFTIDsTemplate } from "./generated/src/cadence/scripts/getNFTIDs";
import { CODE as getNFTsTemplate } from "./generated/src/cadence/scripts/getNFTs";

export default (address) => {
  return {
    name: "Alchemy Platform",
    getData: async () => {
      const [idList, idErr] = await query({
        code: getNFTIDsTemplate,
        args: [address],
      });

      if (idErr) {
        return [[], idErr];
      }

      const [nftList, err] = await query({
        code: getNFTsTemplate,
        args: [address, idList],
      });

      if (err) {
        return [[], err];
      }

      return [nftList, null];
    },
    mapData: (item) => {
      console.log({ item });
      return item;
    },
  };
};
