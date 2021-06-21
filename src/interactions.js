import { resolveArguments } from "./args";
import { replaceImportAddresses } from "./imports";

export const executeScript = async (props) => {
  const { code, args, addressMap, limit } = props;

  const ixCode = replaceImportAddresses(code, addressMap);
  const ixLimit = limit || 100;

  const ix = [fcl.script(ixCode)];
  if (args) {
    ix.push(fcl.args(resolveArguments(args, code)));
  }
  ix.push(fcl.limit(ixLimit));

  const response = await fcl.send(ix);
  return fcl.decode(response);
};
