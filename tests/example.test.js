// files
import { sansExtension } from "../generator/src";

// imports
import { extractImports, missingImports, report, replaceImportAddresses } from "../src";

// arguments
import { mapArgument, mapArguments, mapValuesToCode } from "../src";

// parser
import {
  CONTRACT,
  TRANSACTION,
  SCRIPT,
  getTemplateInfo,
  extractSigners,
  extractScriptArguments,
  extractTransactionArguments,
  extractContractName,
  splitArgs,
  argType,
  getDictionaryTypes,
  getArrayType,
} from "../src";

// Interactions
import { setEnvironment, getEnvironment } from "../src";

// Templates
import "../generator/src/templates";

describe("documentation examples", function () {
  // Files
  it("should strip extension from filename", function () {
    const fileName = sansExtension("log-message-and-return.cdc");
    expect(fileName).toBe("log-message-and-return");
  });

  // Imports
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
    expect(replaced.includes("import Messages from 0xf8d6e0586b0a20c7")).toBe(true);
  });

  // Arguments
  it("should convert value to sdk argument", async function () {
    const type = "String";
    const value = "Hello from Cadence";
    const arg = await mapArgument(type, value);

    expect(arg.value).toBe(value);
    expect(arg.xform.label).toBe(type);
  });

  it("should convert values to sdk arguments", async function () {
    const schema = ["String", "Int"];
    const values = ["Hello from Cadence", 1337];
    const args = await mapArguments(schema, values);

    for (let i = 0; i < schema.length; i++) {
      const type = schema[i];
      const value = values[i];
      const arg = args[i];

      expect(arg.value).toBe(value);
      expect(arg.xform.label).toBe(type);
    }
  });

  it("should convert values to sdk dictionary arguments", async function () {
    const code = `
      pub fun main(metadata: {String:String}, key: String):String {
        return metadata[key]!
      }
    `;
    const values = [
      { language: "Cadence", languageRating: "Cadence is Awesome 🤟" },
      "languageRating",
    ];
    const [metadata, key] = await mapValuesToCode(code, values);

    expect(metadata.xform.label).toBe("Dictionary");
    expect(metadata.value[0].key).toBe("language");
    expect(metadata.value[0].value).toBe("Cadence");

    expect(metadata.value[1].key).toBe("languageRating");
    expect(metadata.value[1].value).toBe("Cadence is Awesome 🤟");

    expect(key.value).toBe("languageRating");
  });

  it("should throw an error if not enough arguments", async function () {
    await expect(async () => {
      const code = `
      pub fun main(metadata: {String:String}, key: String):String {
        return metadata[key]!
      }
    `;
      const values = [{ language: "Cadence", languageRating: "Cadence is Awesome 🤟" }];
      await mapValuesToCode(code, values);
    }).rejects.toThrowError("Not enough arguments");
  });

  // Parser
  it("should return information for contract code", function () {
    const contract = `
      pub contract HelloWorld{
        init(){}
      }
    `;
    const info = getTemplateInfo(contract);

    expect(info.type).toBe(CONTRACT);
    expect(info.contractName).toBe("HelloWorld");
    expect(info.signers).toBe(1);
    expect(info.args.length).toBe(0);
  });

  it("should return information for transaction code", function () {
    const tx = `
      transaction(message: String){
        prepare(signer: AuthAccount){
          log("done")  
        }
      }
    `;
    const info = getTemplateInfo(tx);

    expect(info.type).toBe(TRANSACTION);
    expect(info.signers).toBe(1);
    expect(info.args.length).toBe(1);
    expect(info.args[0]).toBe("message:String");
  });

  it("should return information for script code", function () {
    const script = `
      pub fun main(message:String):String{
        return 42
      }
    `;
    const info = getTemplateInfo(script);

    expect(info.type).toBe(SCRIPT);
    expect(info.args.length).toBe(1);
    expect(info.args[0]).toBe("message:String");
  });

  it("should return array of signer pairs", function () {
    const tx = `
      transaction(message: String){
        prepare(signer: AuthAccount, payer: AuthAccount){
          log("done")  
        }
      }
    `;
    const signers = extractSigners(tx);
    expect(signers.length).toBe(2);
  });

  it("should return 0 signers for script", function () {
    const script = `
      pub fun main(){
        log("nothing to see here :)")
      }
    `;
    const signers = extractSigners(script);
    expect(signers.length).toBe(0);
  });

  it("should extract script arguments", function () {
    const script = `
      pub fun main(message: String, metadata: {String:String}){
        log(message)
      }
    `;
    const args = extractScriptArguments(script);

    expect(args.length).toBe(2);
    expect(args[0]).toBe("message:String");
    expect(args[1]).toBe("metadata:{String:String}");
  });

  it("should extract transaction arguments", function () {
    const tx = `
      transaction(message: String, metadata: {String:String}){
        prepare(signer:AuthAccount){
          
        }
      }
    `;
    const args = extractTransactionArguments(tx);

    expect(args.length).toBe(2);
    expect(args[0]).toBe("message:String");
    expect(args[1]).toBe("metadata:{String:String}");
  });

  it("should extract contract name", function () {
    const contract = `
      pub contract HelloWorld{
        init(){}
      }
    `;
    const name = extractContractName(contract);
    expect(name).toBe("HelloWorld");
  });

  it("should properly split argument pair - String", function () {
    const pair = "message:String";
    const [name, type] = splitArgs(pair);
    expect(name).toBe("message");
    expect(type).toBe("String");
  });

  it("should properly split argument pair - Dictionary", function () {
    const pair = "metadata: {String:String}";
    const [name, type] = splitArgs(pair);
    expect(name).toBe("metadata");
    expect(type).toBe("{String:String}");
  });

  it("should properly split argument pair - Complex", function () {
    const pair = "metadata: [{String:String}]";
    const [name, type] = splitArgs(pair);
    expect(name).toBe("metadata");
    expect(type).toBe("[{String:String}]");
  });

  it("should properly get argument type", function () {
    const simplePair = "message:String";
    const metaPair = "metadata: {String:String}";

    const simple = argType(simplePair);
    const meta = argType(metaPair);

    expect(simple).toBe("String");
    expect(meta).toBe("{String:String}");
  });

  it("should resolve Dictionary type", function () {
    const type = "{String: String}";
    const types = getDictionaryTypes(type);
    const [keyType, valueType] = types;

    expect(types.length).toBe(2);
    expect(keyType).toBe("String");
    expect(valueType).toBe("String");
  });

  it("should resolve Array type", function () {
    const simpleType = getArrayType("[String]");
    const complexType = getArrayType("[{String: String}]");

    expect(simpleType).toBe("String");
    expect(complexType).toBe("{String:String}");
  });

  // Generator
  // This block is commented out for CI to work properly
  /*
  it("should generate files from local folder", async function () {
    const input = path.resolve("./tests/cadence");
    const output = path.resolve("./tests/generated/localRegistry");
    await processFolder(input, output);
  });

  it("should generate files from github", async function () {
    const url = "https://github.com/onflow/flow-core-contracts";
    const output = path.resolve("./tests/generated/remoteRegistry");
    await processGitRepo(url, output);
  });
   */

  // Interactions
  it("should throw error for unknown network", async function () {
    await expect(async () => {
      await setEnvironment("Rinkeby");
    }).rejects.toThrow();
  });

  it("should properly interact with environments", async function () {
    await setEnvironment("Mainnet");

    const addressMap = await getEnvironment();
    expect(addressMap.FlowToken).toBe("0x1654653399040a61");
  });
});
