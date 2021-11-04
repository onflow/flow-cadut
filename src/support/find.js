import { executeScript } from "../interactions";

export const isFindAddress = (address) => {
  const noSpaces = address.replace(/\s/g, "");
  const suffixMatcher = /^[a-z0-9-]{3,16}.find$/;
  const prefixMathcer = /^find:[a-z0-9-]{3,16}$/;
  return suffixMatcher.test(noSpaces) || prefixMathcer.test(noSpaces);
};

export const extractName = (address) => {
  const result = address.replace(/\s/g, "").replace("find:", "").replace(".find", "");

  console.log({ address, result });
  return result;
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
