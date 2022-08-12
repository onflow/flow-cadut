import {extractImports, replaceImportAddresses} from "../src"

describe("imports tests", () => {
  it("extractImports - shall return a list of imports", () => {
    const code = `
            import HelloWorld from 0x01
        `
    const imports = extractImports(code)
    expect(imports["HelloWorld"]).toBe("0x01")
  })

  it("extractImports - shall return a list for multiple imports", () => {
    const code = `
            import First from 0x01
            import Second from 0x02
        `
    const imports = extractImports(code)
    expect(imports["First"]).toBe("0x01")
    expect(imports["Second"]).toBe("0x02")
  })

  it("extractImports - shall skip import keyword in comments", () => {
    const code = `
            // this code will mention import in comments block
            // and then try to import from 0x01
            import HelloWorld from 0x01
        `
    const imports = extractImports(code)
    expect(imports["HelloWorld"]).toBe("0x01")
  })

  it("extractImports - shall work with multiple imports", () => {
    const code = `
            import HelloWorld, GiraffeNFT from 0x01
        `
    const imports = extractImports(code)
    expect(imports["HelloWorld"]).toBe("0x01")
  })

  it("replaceImportAddresses - should replace single import addresses", function () {
    const code = `
      import Messages from 0x01
      pub fun main(){}
    `
    const addressMap = {
      Messages: "0xf8d6e0586b0a20c7",
    }
    const replaced = replaceImportAddresses(code, addressMap)
    expect(replaced.includes("import Messages from 0xf8d6e0586b0a20c7")).toBe(
      true
    )
  })

  it("replaceImportAddresses - should replace import for multiple imports", function () {
    const code = `
      import Messages, GiraffeNFT from 0x01
      pub fun main(){}
    `
    const addressMap = {
      Messages: "0xf8d6e0586b0a20c7",
      GiraffeNFT: "0xf8d6e0586b0a20c7",
    }
    const replaced = replaceImportAddresses(code, addressMap)
    expect(
      replaced.includes("import Messages, GiraffeNFT from 0xf8d6e0586b0a20c7")
    ).toBe(true)
  })

  it("replaceImportAddresses - should replace import for multiple imports with whitespace", function () {
    const code = `
      import   Messages,  GiraffeNFT    from 0x01
      pub fun main(){}
    `
    const addressMap = {
      Messages: "0xf8d6e0586b0a20c7",
      GiraffeNFT: "0xf8d6e0586b0a20c7",
    }
    const replaced = replaceImportAddresses(code, addressMap)
    console.log(replaced)
    expect(
      replaced.includes("import Messages, GiraffeNFT from 0xf8d6e0586b0a20c7")
    ).toBe(true)
  })
})
