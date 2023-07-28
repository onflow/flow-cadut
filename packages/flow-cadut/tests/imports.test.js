import {extractImports, replaceImportAddresses} from "../src"
import {REGEXP_IMPORT, REGEXP_IMPORT_CONTRACT} from "../src/imports"

describe("imports RegExp tests", () => {
  it("REGEXP_IMPORT - shall match import with one contract", () => {
    const test = "import Foo from 0x01"
    const [match] = test.matchAll(REGEXP_IMPORT)
    expect(match[1]).toBe("Foo")
    expect(match[3]).toBe("0x01")
  })

  it("REGEXP_IMPORT - shall match import with integer in name", () => {
    const test = "import F2oo from 0x01"
    const [match] = test.matchAll(REGEXP_IMPORT)
    expect(match[1]).toBe("F2oo")
    expect(match[3]).toBe("0x01")
  })

  it("REGEXP_IMPORT - shall match import with one filename", () => {
    const test = 'import Foo from "Foo.cdc"'
    const [match] = test.matchAll(REGEXP_IMPORT)
    expect(match[1]).toBe("Foo")
    expect(match[3]).toBe('"Foo.cdc"')
  })

  it("REGEXP_IMPORT - shall match import with multiple contracts", () => {
    const test = "import Foo, Bar from 0x01"
    const [match] = test.matchAll(REGEXP_IMPORT)
    expect(match[1]).toEqual("Foo, Bar")
    expect(match[3]).toEqual("0x01")
  })

  it("REGEXP_IMPORT - shall match import with multiple contracts with variable whitespace", () => {
    const test = "import    Foo,  Bar    from  0x01"
    const [match] = test.matchAll(REGEXP_IMPORT)
    expect(match[1]).toEqual("Foo,  Bar")
    expect(match[3]).toEqual("0x01")
  })

  it("REGEXP_IMPORT - shall match import with trailing comma", () => {
    const test = "import Foo, from 0x01"
    const [match] = test.matchAll(REGEXP_IMPORT)
    expect(match).toEqual(undefined)
  })

  it("REGEXP_IMPORT - shall not match without import tag", () => {
    const test = "impgsaorst Foo from 0x01"
    const [match] = test.matchAll(REGEXP_IMPORT)
    expect(match).toEqual(undefined)
  })

  it("REGEXP_IMPORT - shall not match without import address", () => {
    const test = "import Foo from"
    const [match] = test.matchAll(REGEXP_IMPORT)
    expect(match[1]).toEqual("Foo")
  })

  it("REGEXP_IMPORT - shall not match without space preceeding imports", () => {
    const test = "importFoo, Bar from 0x123"
    const [match] = test.matchAll(REGEXP_IMPORT)
    expect(match).toEqual(undefined)
  })

  it("REGEXP_IMPORT_CONTRACT - shall extract comma separated contract names", () => {
    const test = "Foo, Bar"
    const match = test.match(REGEXP_IMPORT_CONTRACT)
    expect(match).toEqual(["Foo", "Bar"])
  })

  it("REGEXP_IMPORT_CONTRACT - shall extract contract names with integers", () => {
    const test = "Fo2o, Ba5r"
    const match = test.match(REGEXP_IMPORT_CONTRACT)
    expect(match).toEqual(["Fo2o", "Ba5r"])
  })
})

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
    expect(
      replaced.includes("import Messages, GiraffeNFT from 0xf8d6e0586b0a20c7")
    ).toBe(true)
  })

  it("replaceImportAddresses - should properly inject import target for single contracts", function () {
    const code = `
      import   Messages
      pub fun main(){}
    `
    const addressMap = {
      Messages: "0xf8d6e0586b0a20c7",
      GiraffeNFT: "0xf8d6e0586b0a20c7",
    }
    const replaced = replaceImportAddresses(code, addressMap)
    expect(replaced.includes("import Messages from 0xf8d6e0586b0a20c7")).toBe(
      true
    )
  })

  it("replaceImportAddresses - should properly inject import target for multiple contracts", function () {
    const code = `
      import   Messages,  GiraffeNFT
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
})

describe("Built-in contracts", () => {
  it("replaceImportAddresses - should keep import unchanged for built-in contracts", function () {
    const code = `
      import Crypto
      pub fun main(){}
    `
    const addressMap = {
      Crypto: "0xf8d6e0586b0a20c7",
    }
    const replaced = replaceImportAddresses(code, addressMap)
    expect(replaced.includes("0xf8d6e0586b0a20c7")).toBe(false)
  })

  it("replaceImportAddresses - should keep import unchanged for contracts with address map", function () {
    const code = `
      import Crypto
      pub fun main(){}
    `
    const replaced = replaceImportAddresses(code, {})
    expect(replaced.includes("Crypto\n")).toBe(true)
  })
})
