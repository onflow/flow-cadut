import { extractImports } from "../src";

describe("imports tests", () => {
  it("shall return a list of imports", () => {
    const code = `
            import HelloWorld from 0x01
        `;
    const imports = extractImports(code);
    expect(imports["HelloWorld"]).toBe("0x01");
  });

  it("shall return a list of imports", () => {
    const code = `
            import First from 0x01
            import Second from 0x02
        `;
    const imports = extractImports(code);
    expect(imports["First"]).toBe("0x01");
    expect(imports["Second"]).toBe("0x02");
  });

  it("shall skip import keyword in comments", () => {
    const code = `
            // this code will mention import in comments block
            // and then try to import from 0x01
            import HelloWorld from 0x01
        `;
    const imports = extractImports(code);
    expect(imports["HelloWorld"]).toBe("0x01");
  });
});
