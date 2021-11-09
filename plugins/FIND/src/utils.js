import { executeScript } from "../../../src";

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
  const code = `
    import FIND from 0xFIND

    pub fun main(name: String) :  Address? {
        return FIND.lookupAddress(name)
    }
  `;
  const args = [extractName(address)];
  return executeScript({ code, args });
};
