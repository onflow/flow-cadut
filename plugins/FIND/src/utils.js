import { executeScript } from "../../../src";
import { contractHolder } from "./const";
import { getEnvironmentName } from "../../../src/env";

export const isFindAddress = (address) => {
  const noSpaces = address.replace(/\s/g, "");
  const suffixMatcher = /^[a-z0-9-]{3,16}.find$/;
  const prefixMathcer = /^find:[a-z0-9-]{3,16}$/;
  return suffixMatcher.test(noSpaces) || prefixMathcer.test(noSpaces);
};

export const extractName = (address) => {
  return address.replace(/\s/g, "").replace("find:", "").replace(".find", "");
};

export const findAddress = async (address) => {
  // TODO: Implement caching
  const code = `
    import FIND from 0xFIND

    pub fun main(name: String) :  Address? {
        return FIND.lookupAddress(name)
    }
  `;
  const name = extractName(address);
  const args = [name];

  const env = await getEnvironmentName();
  const addressMap = {
    FIND: contractHolder[env],
  };

  const [value, err] = await executeScript({ code, args, addressMap });
  if (err) {
    return null;
  } else {
    return value;
  }
};
