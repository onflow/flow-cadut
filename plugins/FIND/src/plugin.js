import { extractName, findAddress, isFindAddress } from "./utils";
import { isAddress } from "../../../src/type-checker";

const plugin = (type, value) => {
  if (isAddress(type) && isFindAddress(value)) {
    const name = extractName(value);
    console.log({ value, name });
    return findAddress(name);
  }
};

export default plugin;
