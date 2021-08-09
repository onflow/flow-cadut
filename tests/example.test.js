import { extractImports, missingImports, report, replaceImportAddresses } from "../src";

describe("documentation examples", function () {
  it("should return import list", function () {
    const code = `
      import Message from 0x01
      import Utilities from 0x02
      
      pub fun main(){
        Utilities.log(Message.hello)
      }
    `;
    const imports = extractImports(code);
    const keys = Object.keys(imports);

    expect(keys.length).toBe(2);
    expect(keys[0]).toBe("Message");
    expect(keys[1]).toBe("Utilities");
  });

  it("should return missing list", function () {
    const code = `
      import Message from 0x01
      import Utilities from 0x02
      
      pub fun main(){
        Utilities.log(Message.hello)
      }
    `;

    const missing = missingImports(code, {
      Message: "0x01",
    });

    expect(missing.length).toBe(1);
    expect(missing[0]).toBe("Utilities");
  });

  it("should report to console", function () {
    const list = ["Message", "Log"];
    report(list);
  });

  it("should replace import addresses", function () {
    const code = `
      import Messages from 0x01
      pub fun main(){}
    `;
    const addressMap = {
      Messages: "0xf8d6e0586b0a20c7",
    };
    const replaced = replaceImportAddresses(code, addressMap);
    console.log({ replaced });
  });
});
