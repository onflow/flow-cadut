import { setEnvironment } from "../../src";
import { getView } from "../../views";
import Flovatars from "../../views/src/Flovatars";
import VersusArt from "../../views/src/Versus";

describe("views", () => {
  it("fetch flowvatars", async () => {
    await setEnvironment("mainnet");
    const [flowvatars, flowvatarsErr] = await getView(Flovatars, "0x886f3aeaf848c535");
    const [art] = await getView(VersusArt, "0x886f3aeaf848c535");
    console.log({flowvatars, art})
    console.error(flowvatarsErr)
  });
});
