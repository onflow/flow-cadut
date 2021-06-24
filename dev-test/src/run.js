import flow from "./generated";
import { deployContract } from "../../src";
import { authorization } from "./crypto";
import { init } from "./utils";

(async () => {
  init();
  const serviceAccount = authorization();
  const signers = [serviceAccount]
  const [result, err] = await flow.transactions.log({signers})
  console.log({result, err})

  // Deploy Basic contract
  /*
  const code = await flow.contracts.BasicTemplate();
  const [result, err] = await deployContract({
    name: "Basic",
    to: auth,
    update: false,
    code,
  });
   */
})();
