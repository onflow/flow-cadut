import { setEnvironment } from "../../src";
import { findLatestEvents, getChainHeight, getEventName, getEventsInRange } from "../../src/events";
import { decode, getEventsAtBlockHeightRange, send } from "@onflow/fcl";
import { CURRENT_SPORK_ROOT } from "../../src/const";

const GoatedGoats = "0x2068315349bdfce5";
const goatedEvents = {
  GoatedGoatsManager: {
    RedeemGoatVoucher: {
      address: GoatedGoats,
      contractName: "GoatedGoatsManager",
      eventName: "RedeemGoatVoucher",
    },
    UpdateGoatEditionMetadata: {
      address: GoatedGoats,
      contractName: "GoatedGoatsManager",
      eventName: "UpdateGoatEditionMetadata",
    },
  },
};

const minutes = 10;
const seconds = 60 * 1000;
const testTimeout = minutes * seconds;
jest.setTimeout(testTimeout);

console.warn = jest.fn();

describe("events", () => {
  beforeAll(() => {
    jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterAll(() => {
    console.warn.mockRestore();
  });

  beforeEach(async () => {
    await setEnvironment("mainnet");
  });

  afterEach(() => {
    console.warn.mockClear();
  });

  it("shall return some events", async () => {
    const event = goatedEvents.GoatedGoatsManager.RedeemGoatVoucher;
    const events = await getEventsInRange(event);
    console.log({ events });
  });
  it("shall show warnings", async () => {
    const overflow = CURRENT_SPORK_ROOT - 10;
    const event = goatedEvents.GoatedGoatsManager.RedeemGoatVoucher;
    const events = await getEventsInRange(event, {
      from: overflow,
      to: overflow,
    });
    expect(console.warn).toHaveBeenCalledTimes(2);
    expect(events.length).toBe(0)
  });
  it("shall find events on chain", async () => {
    const start = 26234164;
    const delay = 50;
    const step = 200;
    const cycles = 1000;
    const maxRange = step * cycles;

    const event = goatedEvents.GoatedGoatsManager.RedeemGoatVoucher;
    const { events } = await findLatestEvents(event, {
      delay,
      start,
      step,
      maxRange,
    });

    console.log(events);
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      console.log(event.data);
    }
  });
  it("shall find trait events on chain", async () => {
    const start = 26223564;
    const delay = 50;
    const step = 200;
    const cycles = 500;
    const maxRange = step * cycles;

    const event = goatedEvents.GoatedGoatsManager.UpdateGoatEditionMetadata;
    const { events } = await findLatestEvents(event, {
      delay,
      start,
      step,
      maxRange,
    });

    console.log(events);
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      console.log(event.data);
    }
  });
  it("shall find Flow fees events", async () => {
    const event = {
      address: "0xf919ee77447b7497",
      contractName: "FlowFees",
      eventName: "TokensDeposited",
    };

    const events = await getEventsInRange(event, {
      from: 26394506,
      to: 26394506,
    });
    console.log(events.length);
  });
});
