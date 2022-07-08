import { mapArgument, mapArguments, argType, mapValuesToCode, resolveType, raw } from "../src/args";
import { toFixedValue, withPrefix } from "../src/fixer";
import { getTemplateInfo } from "../src";

describe("argument types", () => {
  test("Basic Type", async () => {
    const input = "a: Int";
    const expected = "Int";
    const output = argType(input);
    expect(output).toBe(expected);
  });
  test("Dictionary", async () => {
    const input = "metadata       : {String:     String}";
    const expected = "{String:String}";
    const output = argType(input);
    expect(output).toBe(expected);
  });
  test("Array", async () => {
    const input = "list: [String]";
    const expected = "[String]";
    const output = argType(input);
    expect(output).toBe(expected);
  });
  test("Array of Dictionaries", async () => {
    const input = "list: [{String :   String      }]";
    const expected = "[{String:String}]";
    const output = argType(input);
    expect(output).toBe(expected);
  });
  test("Dictionary of Arrays", async () => {
    const input = "metadata: {UFix64:[String]}";
    const expected = "{UFix64:[String]}";
    const output = argType(input);
    expect(output).toBe(expected);
  });

  test("Nested Arrays", async () => {
    const input = "listOfLists: [[String]]";
    const expected = "[[String]]";
    const output = argType(input);
    expect(output).toBe(expected);
  });
});

describe("type resolvers", () => {
  test("basic type - Address", () => {
    const cases = [
      {
        type: "Address",
        argInput: "0x11",
      },
      {
        type: "String",
        argInput: "Cadence",
      },
      {
        type: "Int",
        argInput: 42,
      },
      {
        type: "UFix64",
        argInput: "0.1337",
      },
      {
        type: "Bool",
        argInput: true,
      },
    ];

    for (let i = 0; i < cases.length; i++) {
      const { type, argInput } = cases[i];
      const output = resolveType(type);
      const asArgument = output.asArgument(argInput);

      expect(asArgument.type).toBe(type);
      expect(asArgument.value.toString()).toBe(argInput.toString());
    }
  });
  test("simple array = [String]", () => {
    const input = "[String]";
    const output = resolveType(input);
    const argInput = ["Cadence"];
    const asArgument = output.asArgument(argInput);

    expect(output.label).toBe("Array");
    expect(asArgument.value[0].type).toBe("String");
    expect(asArgument.value[0].value).toBe(argInput[0]);
  });
  test("nested array - [[String]]", () => {
    const input = "[[String]]";
    const output = resolveType(input);
    const argInput = [["Cadence"]];
    const asArgument = output.asArgument(argInput);

    expect(output.label).toBe("Array");
    expect(asArgument.value[0].type).toBe("Array");
    expect(asArgument.value[0].value.length).toBe(argInput[0].length);
  });
});

describe("mapArgument", () => {
  test("Int", async () => {
    const type = "Int";
    const input = 42;
    const output = await mapArgument(type, input);

    expect(output.xform.label).toBe(type);
    expect(output.value).toBe(input);
  });
  test("UInt", async () => {
    const type = "UInt";
    const input = 42;
    const output = await mapArgument(type, input);

    expect(output.xform.label).toBe(type);
    expect(output.value).toBe(input);
  });
  test("Fix", async () => {
    const type = "Fix64";
    const input = 42.01;
    const output = await mapArgument(type, input);

    expect(output.xform.label).toBe(type);
    expect(output.value).toBe(toFixedValue(input));
  });
  test("UFix", async () => {
    const type = "UFix64";
    const input = 1.337;
    const output = await mapArgument(type, input);

    expect(output.xform.label).toBe(type);
    expect(output.value).toBe(toFixedValue(input));
  });
  test("String", async () => {
    const type = "String";
    const input = "Hello, Cadence";
    const output = await mapArgument(type, input);

    expect(output.xform.label).toBe(type);
    expect(output.value).toBe(input);
  });
  test("Character", async () => {
    const type = "Character";
    const input = "a";
    const output = await mapArgument(type, input);

    expect(output.xform.label).toBe(type);
    expect(output.value).toBe(input);
  });
  test("Bool", async () => {
    const type = "Bool";
    const input = true;
    const output = await mapArgument(type, input);

    expect(output.xform.label).toBe(type);
    expect(output.value).toBe(input);
  });
  test("Address - with prefix", async () => {
    const type = "Address";
    const input = "0x01";
    const output = await mapArgument(type, input);

    expect(output.xform.label).toBe(type);
    expect(output.value).toBe(input);
  });
  test("Address - no prefix", async () => {
    const type = "Address";
    const input = "01";
    const output = await mapArgument(type, input);

    expect(output.xform.label).toBe(type);
    expect(output.value).toBe(withPrefix(input));
  });
  test("Array - of Int", async () => {
    const type = "[Int]";
    const input = [1, 2, 3, 4, 5];
    const output = await mapArgument(type, input);

    expect(output.xform.label).toBe("Array");
    expect(output.value.length).toBe(5);
  });
  test("Dictionary - {String: String}", async () => {
    const type = "{String: String}";
    const input = {
      name: "James",
      surname: "Hunter",
    };
    const output = await mapArgument(type, input);

    expect(output.xform.label).toBe("Dictionary");
    expect(output.value.length).toBe(2);

    expect(output.value[0].key).toBe("name");
    expect(output.value[0].value).toBe("James");

    expect(output.value[1].key).toBe("surname");
    expect(output.value[1].value).toBe("Hunter");
  });
  test("Dictionary - {String: UFix64}", async () => {
    const type = "{String: UFix64}";
    const input = {
      balance: "1.337",
    };
    const output = await mapArgument(type, input);

    expect(output.xform.label).toBe("Dictionary");
    expect(output.value.length).toBe(1);
    expect(output.value[0].key).toBe("balance");
    expect(output.value[0].value).toBe("1.337");
  });
  test("Array of Dictionaries - [{String: UFix64}]", async () => {
    const type = "[{String: UFix64}]";
    const input = [
      {
        balance: "1.337",
      },
      {
        balance: "1.337",
        name: "James",
      },
    ];
    const output = await mapArgument(type, input);

    expect(output.xform.label).toBe("Array");
    expect(output.value.length).toBe(input.length);

    for (let i = 0; i < input.length; i++) {
      const dict = input[i];
      const outputSlice = output.value[i];
      const keys = Object.keys(dict);

      for (let j = 0; j < keys.length; j++) {
        const key = keys[j];
        const dictValue = dict[key];
        expect(outputSlice[j].key).toBe(key);
        expect(outputSlice[j].value).toBe(dictValue);
      }
    }
  });
  test("Dictionaries of Arrays  - {String: [String]}", async () => {
    const type = "{String: String}";
    const input = {
      names: ["Alice", "Bob", "Charlie"],
    };

    const output = await mapArgument(type, input);

    expect(output.xform.label).toBe("Dictionary");
    expect(output.value.length).toBe(1);
    expect(output.value[0].key).toBe("names");
    expect(output.value[0].value[0]).toBe("Alice");
    expect(output.value[0].value[1]).toBe("Bob");
    expect(output.value[0].value[2]).toBe("Charlie");
  });

  test("Nested Array - [[String]]", async () => {
    const type = "[[String]]";
    const input = [["Cadence"]];
    const output = await mapArgument(type, input);

    expect(output.xform.label).toBe("Array");
    expect(output.value[0].length).toBe(input[0].length);
    expect(output.value[0][0]).toBe(input[0][0]);
  });
  test("Path", async () => {
    const type = "Path";
    const input = "/public/FlowTokens";
    const output = await mapArgument(type, input);
    expect(output.value["domain"]).toBe("public");
    expect(output.value["identifier"]).toBe("FlowTokens");
    expect(output.xform.label).toBe("Path");
  });
  test("Public Path", async () => {
    const type = "PublicPath";
    const input = "/public/FlowTokens";
    const output = await mapArgument(type, input);
    expect(output.value["domain"]).toBe("public");
    expect(output.value["identifier"]).toBe("FlowTokens");
    expect(output.xform.label).toBe("Path");
  });
  test("Private Path", async () => {
    const type = "PrivatePath";
    const input = "/private/FlowTokens";
    const output = await mapArgument(type, input);
    expect(output.value["domain"]).toBe("private");
    expect(output.value["identifier"]).toBe("FlowTokens");
    expect(output.xform.label).toBe("Path");
  });
  test("Storage Path", async () => {
    const type = "StoragePath";
    const input = "/storage/FlowTokens";
    const output = await mapArgument(type, input);
    expect(output.value["domain"]).toBe("storage");
    expect(output.value["identifier"]).toBe("FlowTokens");
    expect(output.xform.label).toBe("Path");
  });
  test("Capability Path", async () => {
    const typePrivate = "PrivatePath";
    const inputPrivate = "/private/FlowTokens";
    const outputPrivate = await mapArgument(typePrivate, inputPrivate);

    const typePublic = "PublicPath";
    const inputPublic = "/public/FlowTokens";
    const outputPublic = await mapArgument(typePublic, inputPublic);

    expect(outputPrivate.value["domain"]).toBe("private");
    expect(outputPrivate.value["identifier"]).toBe("FlowTokens");
    expect(outputPrivate.xform.label).toBe("Path");

    expect(outputPublic.value["domain"]).toBe("public");
    expect(outputPublic.value["identifier"]).toBe("FlowTokens");
    expect(outputPublic.xform.label).toBe("Path");
  });
});

describe("complex example", () => {
  test("multiple values from code", async () => {
    const code = `pub fun main(a: Int, b: Address, c: [String], d: UFix64) { }`;
    const argValues = [42, "0x01", ["Hello, World"], 1.337];

    const schema = getTemplateInfo(code).args.map(argType);
    const output = await mapArguments(schema, argValues);

    expect(output.length).toBe(argValues.length);

    expect(output[0].value).toBe(42);
    expect(output[0].xform.label).toBe("Int");

    expect(output[1].value).toBe("0x01");
    expect(output[1].xform.label).toBe("Address");

    expect(output[2].value).toEqual(["Hello, World"]);
    expect(output[2].xform.label).toBe("Array");

    expect(output[3].value).toBe(toFixedValue("1.337"));
    expect(output[3].xform.label).toBe("UFix64");
  });

  test("multiple values from code - shall fail conversion", async () => {
    const code = `pub fun main(a: Int, b: Address, c: [String], d: UFix64) { }`;

    const invoke = (args) => async () => {
      try {
        return mapValuesToCode(code, args);
      } catch (e) {
        return e.message;
      }
    };

    // Schema expects more parameters to be provided
    expect(invoke(["42"])).rejects.toThrowError("Not enough arguments");

    // Incorrect integer value provided
    expect(invoke(["42", "0x01", ["Hello"], "1.337"])).rejects.toThrowError(
      "Type Error: Expected Integer for type Int"
    );

    // Incorrect address
    expect(invoke([42, true, ["Sup"], "1.337"])).rejects.toThrowError(
      "address.replace is not a function"
    );
    expect(invoke([42, 12, ["Sup"], "1.337"])).rejects.toThrowError(
      "address.replace is not a function"
    );
    expect(invoke([42, [1, 2, 3], ["Sup"], "1.337"])).rejects.toThrowError(
      "address.replace is not a function"
    );

    // Incorrect array
    expect(invoke([42, "0x1", 12, "1.337"])).rejects.toThrowError("t.map is not a function");

    expect(invoke([42, "0x01", ["Hello"], "hello"])).rejects.toThrowError(
      "Type Error: Expected proper value for fixed type"
    );
  });
});

describe("mapValuesToCode", () => {
  test("nested array", async () => {
    const code = `
      pub fun main(list: [[Int]]){
        log(list)
      }
    `;
    const values = [[[1, 3, 3, 7]]];
    const result = await mapValuesToCode(code, values);
    const [first] = result;

    expect(first.xform.label).toBe("Array");
    expect(first.value[0].length).toBe(values[0][0].length);
    for (let i = 0; i < values[0][0].length; i++) {
      expect(first.value[0][i]).toBe(values[0][0][i]);
    }
  });
});

describe("optionals", () => {
  test("Basic Type", async () => {
    const input = "a: Int?";
    const expected = "Int?";
    const output = argType(input);
    expect(output).toBe(expected);
  });

  test("Dictionary", async () => {
    const input = "metadata       : {String:     String?}";
    const expected = "{String:String?}";
    const output = argType(input);
    expect(output).toBe(expected);
  });

  test("simple type", async () => {
    const type = "String?";
    const input = "Cadence";
    const output = resolveType(type);
    const asArgument = output.asArgument(input);

    expect(asArgument.type).toBe("Optional");
    expect(asArgument.value.type).toBe(raw(type));
    expect(asArgument.value.value.toString()).toBe(input.toString());
  });

  test("Dictionary - as argument", async () => {
    const type = "{String: String?}";
    const input = {
      name: "James",
      surname: "Hunter",
      middlename: null,
    };
    const output = await mapArgument(type, input);

    expect(output.xform.label).toBe("Dictionary");
    expect(output.value.length).toBe(3);

    expect(output.value[0].key).toBe("name");
    expect(output.value[0].value).toBe(input.name);

    expect(output.value[1].key).toBe("surname");
    expect(output.value[1].value).toBe(input.surname);

    expect(output.value[2].key).toBe("middlename");
    expect(output.value[2].value).toBe(input.middlename);
  });
});
