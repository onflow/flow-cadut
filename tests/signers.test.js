import {
  processSigner,
  REQUIRE_ADDRESS,
  REQUIRE_PRIVATE_KEY,
  WARNING_KEY_INDEX,
} from "../src/signers";

describe("Signers", () => {
  it("shall throw error for account with empty private key", () => {
    const signers = [
      {
        /* Empty signer */
      },
    ];
    expect(() => {
      signers.map(processSigner);
    }).toThrowError(REQUIRE_PRIVATE_KEY);
  });

  it("shall throw error for account with empty address", () => {
    const privateKey = 42;
    const signers = [{ privateKey }];
    expect(() => {
      signers.map(processSigner);
    }).toThrowError(REQUIRE_ADDRESS);
  });

  it("shall show warning for empty keyId", () => {
    console.warning = jest.fn();
    const privateKey = 42;
    const address = "1234";
    const keyId = undefined; // we explicitly make it undefined
    const signers = [{ privateKey, address, keyId }];
    signers.map(processSigner);
    expect(console.warning).toHaveBeenCalledWith(WARNING_KEY_INDEX(keyId));
  });

  it("shall process properly without errors", () => {
    console.warning = jest.fn();
    const privateKey = 42;
    const address = "1234";
    const keyId = 0;
    const signers = [{ privateKey, address, keyId }];
    signers.map(processSigner);
    expect(console.warning).not.toBeCalled()
  });

  it("shall process single address without errors", () => {
    console.warning = jest.fn();
    const address = "1234"
    const signers = [address];
    let processedSigners
    expect(()=>{
      processedSigners = signers.map(processSigner);
    }).not.toThrow()
    expect(processedSigners.length).toBe(1)
    expect(processedSigners[0]).toBe(address)
    expect(console.warning).not.toBeCalled()
  });
});
