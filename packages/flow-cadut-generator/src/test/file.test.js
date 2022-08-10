const {sansExtension} = require("../file")

describe("file tests", () => {
  // Files
  it("should strip extension from filename", function () {
    const fileName = sansExtension("log-message-and-return.cdc")
    expect(fileName).toBe("log-message-and-return")
  })
})
