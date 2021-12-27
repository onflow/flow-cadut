import { setEnvironment } from "../../src";
import { getView } from "../../views/src";
import Flovatars from "../../views/src/Flovatars";
import VersusArt from "../../views/src/Versus";
import MotoGP from "../../views/src/MotoGP";
import Ballerz from "../../views/src/Ballerz";


describe("views", () => {
  it("fetch flowvatars", async () => {
    await setEnvironment("mainnet");
    const [flowvatars, err] = await getView(Flovatars, "0x886f3aeaf848c535");
    console.log({ flowvatars });
    console.error(err);
  });

  it("fetch versus art", async () => {
    await setEnvironment("mainnet");
    const [art, err] = await getView(VersusArt, "0x886f3aeaf848c535");
    console.log({ art });
    console.error(err);
  });

  it("fetch motogp", async () => {
    await setEnvironment("mainnet");
    const [cards, err] = await getView(MotoGP, "0x53f389d96fb4ce5e");
    console.log({ cards });
    console.error(err);
  });

  it("fetch ballerz", async () => {
    await setEnvironment("mainnet");
    const [ballerz, err] = await getView(Ballerz, "0x4c342b6dafb5bcb1");
    console.log({ ballerz });
    err && console.error(err);
  });
});
