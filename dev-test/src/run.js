import flow from "./generated";
import { deployContract } from "../../src";
import { authorization } from "./crypto";
import { init } from "./utils";

(async () => {
  init();
  const payer = authorization();
  /*
  const [result, err] = await flow.transactions.log({ signers: [payer], payer, proposer: payer });
  console.log({ result, err });
   */

  /*
  // Deploy Basic contract
  const code = await flow.contracts.BasicTemplate()
  console.log({code})

  const [result, err] = await deployContract({
    name: "Basic",
    to: payer,
    update: false,
    code,
  });
  console.log({ result, err });
  */

  // Query Basic
  const addressMap = {
    Basic: "0xf8d6e0586b0a20c7",
  };
  const [result, err] = await flow.scripts.basic({ addressMap });
  console.log({ result, err });
})();
