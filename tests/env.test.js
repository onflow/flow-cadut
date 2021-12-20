import { EXT_ENVIRONMENT, extendEnvironment } from "../src/env";

describe("environment", () => {
  it("shall keep unchanged", async () => {
    const newItems = {};
    extendEnvironment(newItems);
    expect(EXT_ENVIRONMENT.mainnet).toEqual({});
    expect(EXT_ENVIRONMENT.testnet).toEqual({});
    expect(EXT_ENVIRONMENT.emulator).toEqual({});
  });

  it("shall update mainnet", async () => {
    const newItems = {
      mainnet: {
        Art: "0x01",
      },
    };
    extendEnvironment(newItems);
    expect(EXT_ENVIRONMENT.mainnet).toEqual({
      Art: "0x01",
    });
    expect(EXT_ENVIRONMENT.testnet).toEqual({});
    expect(EXT_ENVIRONMENT.emulator).toEqual({});
  });
  it("shall update mainnet and testnet", async () => {
    const newItems = {
      mainnet: {
        Art: "0x01",
      },
      testnet: {
        Art: "0x02",
      },
    };
    extendEnvironment(newItems);
    expect(EXT_ENVIRONMENT.mainnet).toEqual({
      Art: "0x01",
    });
    expect(EXT_ENVIRONMENT.testnet).toEqual({
      Art: "0x02",
    });
    expect(EXT_ENVIRONMENT.emulator).toEqual({});
  });
});
