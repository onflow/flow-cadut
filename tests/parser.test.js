import {
  extractContractName,
  getTemplateInfo,
  CONTRACT,
  SCRIPT,
  TRANSACTION,
  extractTransactionArguments,
  extractScriptArguments,
} from "../src/parser";

describe("parser", () => {
  test("extract script arguments - no arguments", () => {
    const input = `
      pub fun main(){
        log(a)
      }
    `;
    const output = extractScriptArguments(input);
    expect(output.length).toBe(0);
  });

  test("extract script arguments", () => {
    const input = `
      pub fun main(a: Int){
        log(a)
      }
    `;
    const output = extractScriptArguments(input);
    expect(output.length).toBe(1);
  });

  test("extract script arguments - complex arguments", () => {
    const input = `
      pub fun main(metadata: {String:String}){
        log(a)
      }
    `;
    const output = extractScriptArguments(input);
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
    const output = extractTransactionArguments(input);
    expect(output.length).toBe(0);
  });

  test("extract transaction arguments - keyword in comments", () => {
    const input = ` // nothing here
      // this is some basic transaction we want to send
      transaction(a: Int) {
        prepare(){
          log("hello")
        }
      }
    `;
    const output = extractTransactionArguments(input);
    expect(output.length).toBe(1);
  });
});

describe("extract contract name", () => {
  test("extract contract name - contract interface", () => {
    const contractName = "KittyItems";
    const input = `
      pub contract interface ${contractName} {
    `;
    const output = extractContractName(input);
    expect(output).toEqual(contractName);
  });

  test("extract contract name - contract", () => {
    const contractName = "KittyItems";
    const input = `
      pub contract ${contractName} {
    `;
    const output = extractContractName(input);
    expect(output).toEqual(contractName);
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

  test("is transaction - real example", () => {
    const input = `
      import FlowManager from 0x01

      transaction(name:String, code: String, manager: Address ##ARGS-WITH-TYPES##) {
        prepare(acct: AuthAccount){
          let decoded = code.decodeHex()
        }
      }
    `;
    const { type } = getTemplateInfo(input);
    expect(type).toBe(TRANSACTION);
  });
});
