import { waitForStatus } from "../src/interactions";

describe("wait for status", () => {
  it("shall return proper status if null", () => {
    const status = null;
    const output = waitForStatus(status);
    expect(output).toBe("onceSealed");
  });

  it("shall return proper status if unsupported value", () => {
    const status = "ala-ca-blam!";
    const output = waitForStatus(status);
    expect(output).toBe("onceSealed");
  });

  it("shall return proper status if wait for executed", () => {
    const status = "exec";
    const output = waitForStatus(status);
    expect(output).toBe("onceExecuted");
  });

  it("shall return proper status if wait for execution", () => {
    const status = "execution";
    const output = waitForStatus(status);
    expect(output).toBe("onceExecuted");
  });

  it("shall return proper status if wait for final", () => {
    const status = "final";
    const output = waitForStatus(status);
    expect(output).toBe("onceFinalized");
  });

  it("shall return proper status if wait for finalized", () => {
    const status = "finalized";
    const output = waitForStatus(status);
    expect(output).toBe("onceFinalized");
  });
});
