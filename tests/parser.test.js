import {
  extractContractName,
  getTemplateInfo,
  CONTRACT,
  SCRIPT,
  TRANSACTION,
  extractTransactionArguments,
  extractScriptArguments,
  extractContractParameters,
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

  test("extract transaction arguments - multiline declaration", () => {
    const input = ` // nothing here
      // this is some basic transaction we want to send
      transaction(
          a: Int,
          b: String
        ) {
        prepare(){
          log("hello")
        }
      }
    `;
    const output = extractTransactionArguments(input);
    expect(output.length).toBe(2);
  });

  test("extract transaction arguments - spaces in definition", () => {
    const input = `
      transaction ( code: String ) {
        prepare( admin: AuthAccount) { }  
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

describe("extract contract parameters", () => {
  test("no init method in code", () => {
    const contractName = "Hello";
    const input = `
    pub contract ${contractName}     {
      // no init method here either
    }
  `;
    const output = extractContractParameters(input);
    expect(output.contractName).toBe(contractName);
    expect(output.args).toBe("");
  });

  test("no init method in code - interface", () => {
    const contractName = "Hello";
    const input = `
    pub contract interface ${contractName}     {
      // no init method here either
    }
  `;
    const output = extractContractParameters(input);
    expect(output.contractName).toBe(contractName);
    expect(output.args).toBe("");
  });

  test("with init method in code - no arguments", () => {
    const contractName = "Hello";
    const input = `
    pub contract interface ${contractName}     {
      // init method here
      init(){}
    }
  `;
    const output = extractContractParameters(input);
    expect(output.contractName).toBe(contractName);
    expect(output.args).toBe("");
  });

  test("with init method in code - single argument", () => {
    const contractName = "Hello";
    const args = "a: String";
    const input = `
    pub contract interface ${contractName}     {
      // init method here
      init(${args}){}
    }
  `;
    const output = extractContractParameters(input);
    expect(output.contractName).toBe(contractName);
    expect(output.args).toBe(args);
  });

  test("with init method in code - multiple argument", () => {
    const contractName = "Hello";
    const args = "a: String, b: {String: String}";
    const input = `
    pub contract interface ${contractName}     {
      // init method here
      init(${args}){}
    }
  `;
    const output = extractContractParameters(input);
    expect(output.contractName).toBe(contractName);
    expect(output.args).toBe(args);
  });

  test("init method on resource", () => {
    const contractName = "Hello";
    const input = `
    pub contract interface ${contractName}     {
      // init method on resource
      resource Token{
        pub let balance: UInt
        init(balance: UInt){
          self.balance = balance
        }
      }
    }
  `;
    const output = extractContractParameters(input);
    expect(output.contractName).toBe(contractName);
    expect(output.args).toBe("");
  });

  test("init method on resource - contract init before resource", () => {
    const contractName = "Hello";
    const args = "a: String, b: {String: String}";
    const input = `
    pub contract interface ${contractName}     {
      init(${args}){ 
        // contract initialization here
      }
      
      // init method on resource
      resource Token{
        pub let balance: UInt
        init(balance: UInt){
          self.balance = balance
        }
      }
    }
  `;
    const output = extractContractParameters(input);
    expect(output.contractName).toBe(contractName);
    expect(output.args).toBe(args);
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

describe("spaces in definitions", () => {
  test("spaces in definition - transaction", () => {
    const input = `
      transaction ( code: String ) {
        prepare(  signer:   AuthAccount    ) {}
      }
    `;
    const { type, signers, args } = getTemplateInfo(input);
    expect(type).toBe(TRANSACTION);
    expect(signers).toBe(1);
    expect(args.length).toBe(1);
  });

  test("spaces in definition - more spaces", () => {
    const input = `
      transaction      (    code:            String        ) {
        prepare       (  signer:                AuthAccount          ) {}
      }
    `;
    const { type, signers, args } = getTemplateInfo(input);
    expect(type).toBe(TRANSACTION);
    expect(signers).toBe(1);
    expect(args.length).toBe(1);
  });

  test("script", () => {
    const input = `
      pub fun main ( code:        String ) {
         log(code)
      }
    `;
    const { type, args } = getTemplateInfo(input);
    expect(type).toBe(SCRIPT);
    expect(args.length).toBe(1);
  });
});

describe("interaction signatures", () => {
  test("multi line transaction signature - no arguments", async () => {
    const code = `
      // this is some basic transaction we want to send
      transaction     {
        prepare(){}
      }
    `;
    const args = extractTransactionArguments(code);
    expect(args.length).toBe(0);
  });

  test("multi line script signature", async () => {
    const code = `
      // this is some basic transaction we want to send
      pub fun main      (       ) : String { return "Hello" }
    `;
    const args = extractTransactionArguments(code);
    expect(args.length).toBe(0);
  });

  test("multi line transaction signature", async () => {
    const code = `
      // this is some basic transaction we want to send
      transaction(
        a: Int,
        b: String
      ) {
        prepare(){}
      }
    `;
    const args = extractTransactionArguments(code);
    expect(args.length).toBe(2);
    expect(args[0]).toBe("a:Int");
    expect(args[1]).toBe("b:String");
  });
});
