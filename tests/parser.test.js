import {
  extract,
  getTemplateInfo,
  CONTRACT,
  SCRIPT,
  TRANSACTION,
} from "../src/parser";

describe("parser", () => {
  test("extract script arguments", () => {
    const input = `
      pub fun main(a: Int){
        log(a)
      }
    `;
    const output = extract(input, "fun main");
    expect(output.length).toBe(1);
  });

  test("extract transaction arguments - no arguments", () => {
    const input = `
      transaction {
        prepare(){
          log("hello")
        }
      }
    `;
    const output = extract(input, "transaction");
    expect(output.length).toBe(0);
  });
});

describe("template type checker", () => {
  test("is contract - script", () => {
    const input = `
      pub fun main(){}
    `;
    expect(getTemplateInfo(input).type).not.toBe(CONTRACT);
  });
  test("is contract - transaction", () => {
    const input = `
      transaction{
        prepare()
      }
    `;
    expect(getTemplateInfo(input).type).not.toBe(CONTRACT);
  });
  test("is contract - contract", () => {
    const input = `
      pub contract Basic{}
    `;
    expect(getTemplateInfo(input).type).toBe(CONTRACT);
  });
  test("is contract - contract interface", () => {
    const input = `
      pub contract interface      Basic {      }
    `;
    const { type } = getTemplateInfo(input);
    expect(getTemplateInfo(input).type).toBe(CONTRACT);
  });

  test("is script - script", () => {
    const input = `
      pub fun main(){}
    `;
    expect(getTemplateInfo(input).type).toBe(SCRIPT);
  });

  test("is transaction - transaction", () => {
    const input = `
      transaction(a: Int){
        prepare(auth: AuthSigner){
          log(a)
        }
      }
    `;
    const { type, args, signers } = getTemplateInfo(input);
    expect(type).toBe(TRANSACTION);
    expect(signers).toBe(1);
    expect(args.length).toBe(1);
  });
});
