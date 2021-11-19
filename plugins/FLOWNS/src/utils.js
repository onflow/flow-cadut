import { executeScript } from "../../../src";
import { contractHolder } from "./const";
import { getEnvironmentName } from "../../../src/env";

export const isFlownsName = (domainName) => {
  const noSpaces = domainName.replace(/\s/g, "");
  const matcher = /^[a-z0-9-_]{1,30}.[a-z0-9-_]{1,10}$/;
  const flag = matcher.test(noSpaces);
  return flag
};

export const resolveFlownsName = async (domainName) => {
  // TODO: Implement caching
  const code = `
  import Flowns from 0xFlowns
  import Domains from 0xDomains

  pub fun main(name: String, root: String) : Address? {
    let prefix = "0x"
    let rootHahsh = Flowns.hash(node: "", lable: root)
    let namehash = prefix.concat(Flowns.hash(node: rootHahsh, lable: name))
    var address = Domains.getRecords(namehash)
    return address
  }`;
  const nameSplited = domainName.split(".");
  const label = nameSplited[0];
  const root = nameSplited[1];
  const args = [label, root];

  const env = await getEnvironmentName();
  const addressMap = {
    Flowns: contractHolder[env],
    Domains: contractHolder[env],
  };

  const [value, err] = await executeScript({ code, args, addressMap });
  if (err) {
    return null;
  } else {
    return value;
  }
};
