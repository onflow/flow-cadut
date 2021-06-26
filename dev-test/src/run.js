import flow from "./generated";
import { deployContract } from "../../src";
import { authorization } from "./crypto";
import { init } from "./utils";

(async () => {
  init();
  const payer = authorization();

  const [txResult, txErr] = await flow.transactions.log({ signers: [payer], payer, proposer: payer });
  console.log({ txResult, txErr });


  const [result, err] = await flow.contracts.deployBasic({to: payer, update: true})
  console.log({ result, err });

  // Query Basic
  const addressMap = {
    Basic: "0xf8d6e0586b0a20c7",
  };
  const [message] = await flow.scripts.basic({ addressMap });
  console.log({ message });
})();
