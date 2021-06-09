import { mapArgument, mapArguments, argType, mapValuesToCode } from "../src/args";
import { toFixedValue, withPrefix } from "../src/fixer";
import { getTemplateInfo } from "../src/parser";

describe("simple map", () => {
  test("Int", async () => {
    const type = "Int";
    const input = 42;
    const output = mapArgument(type, input);

    expect(output.xform.label).toBe(type);
    expect(output.value).toBe(input);
  });

  test("UInt", async () => {
    const type = "UInt";
    const input = 42;
    const output = mapArgument(type, input);

    expect(output.xform.label).toBe(type);
    expect(output.value).toBe(input);
  });
  test("Fix", async () => {
    const type = "Fix64";
    const input = 42.01;
    const output = mapArgument(type, input);

    expect(output.xform.label).toBe(type);
    expect(output.value).toBe(toFixedValue(input));
  });

  test("UFix", async () => {
    const type = "UFix64";
    const input = 1.337;
    const output = mapArgument(type, input);

    expect(output.xform.label).toBe(type);
    expect(output.value).toBe(toFixedValue(input));
  });

  test("String", async () => {
    const type = "String";
    const input = "Hello, Cadence";
    const output = mapArgument(type, input);

    expect(output.xform.label).toBe(type);
    expect(output.value).toBe(toFixedValue(input));
  });

  test("Character", async () => {
    const type = "Character";
    const input = "a";
    const output = mapArgument(type, input);

    expect(output.xform.label).toBe(type);
    expect(output.value).toBe(toFixedValue(input));
  });

  test("Bool", async () => {
    const type = "Bool";
    const input = true;
    const output = mapArgument(type, input);

    expect(output.xform.label).toBe(type);
    expect(output.value).toBe(input);
  });

  test("Address - with prefix", async () => {
    const type = "Address";
    const input = "0x01";
    const output = mapArgument(type, input);

    expect(output.xform.label).toBe(type);
    expect(output.value).toBe(input);
  });

  test("Address - no prefix", async () => {
    const type = "Address";
    const input = "01";
    const output = mapArgument(type, input);

    expect(output.xform.label).toBe(type);
    expect(output.value).toBe(withPrefix(input));
  });

  test("Array - of Int", async () => {
    const type = "[Int]";
    const input = [1, 2, 3, 4, 5];
    const output = mapArgument(type, input);

    expect(output.xform.label).toBe("Array");
    expect(output.value.length).toBe(5);
  });

  test("Dictionary - {String: String}", async () => {
    const type = "{String: String}";
    const input = {
      name: "James",
      surname: "Hunter",
    };
    const output = mapArgument(type, input);

    expect(output.xform.label).toBe("Dictionary");
    expect(output.value.length).toBe(2);

    expect(output.value[0].key).toBe("name");
    expect(output.value[0].value).toBe("James");

    expect(output.value[1].key).toBe("surname");
    expect(output.value[1].value).toBe("Hunter");
  });

  test("Dictionary - {String: UFix64}", async () => {
    const type = "{String: String}";
    const input = {
      balance: "1.337",
    };
    const output = mapArgument(type, input);

    expect(output.xform.label).toBe("Dictionary");
    expect(output.value.length).toBe(1);
    expect(output.value[0].key).toBe("balance");
    expect(output.value[0].value).toBe("1.337");
  });

  test("Array of Dictionaries - [{String: UFix64}]", async () => {
    const type = "[{String: String}]";
    const input = [
      {
        balance: "1.337",
      },
    ];
    const output = mapArgument(type, input);

    expect(output.xform.label).toBe("Array");
    expect(output.value.length).toBe(input.length);
    expect(output.value[0].value[0].key).toBe("balance");
    expect(output.value[0].value[0].value).toBe("1.337");
  });

  test("Dictionaries of Arrays  - {String: [String]}", async () => {
    const type = "{String: String}";
    const input = {
      names: ["Alice", "Bob", "Charlie"],
    };

    const output = mapArgument(type, input);

    expect(output.xform.label).toBe("Dictionary");
    expect(output.value.length).toBe(1);
    expect(output.value[0].key).toBe("names");
    expect(output.value[0].value[0]).toBe("Alice");
    expect(output.value[0].value[1]).toBe("Bob");
    expect(output.value[0].value[2]).toBe("Charlie");
  });
});

describe("complex example", () => {
  test("multiple values from code", async () => {
    const code = `pub fun main(a: Int, b: Address, c: [String], d: UFix64) { }`;
    const argValues = [42, "0x01", ["Hello, World"], 1.337];

    const schema = getTemplateInfo(code).args.map(argType);
    const output = mapArguments(schema, argValues);

    expect(output.length).toBe(argValues.length);

    expect(output[0].value).toBe(42);
    expect(output[0].xform.label).toBe("Int");

    expect(output[1].value).toBe("0x01");
    expect(output[1].xform.label).toBe("Address");

    expect(output[2].value).toEqual(["Hello, World"]);
    expect(output[2].xform.label).toBe("Array");

    expect(output[3].value).toBe("1.337");
    expect(output[3].xform.label).toBe("UFix64");
  });

  test("multiple values from code - shall fail conversion", async () => {
    const code = `pub fun main(a: Int, b: Address, c: [String], d: UFix64) { }`;

    const invoke = (args) => () => {
      mapValuesToCode(code, args)
    };

    // Schema expects more parameters to be provided
    expect(invoke(["42"])).toThrow("Not enough arguments");

    // Incorrect integer value provided
    expect(invoke(["42", "0x01", ["Hello"], "1.337"])).toThrow(
      "Type Error: Expected Integer for type Int"
    );

    // Incorrect address
    expect(invoke([42, true, ["Sup"], "1.337"])).toThrow("address.replace is not a function");
    expect(invoke([42, 12, ["Sup"], "1.337"])).toThrow("address.replace is not a function");
    expect(invoke([42, [1, 2, 3], ["Sup"], "1.337"])).toThrow("address.replace is not a function");

    // Incorrect array
    expect(invoke([42, "0x1", 12, "1.337"])).toThrow("t.map is not a function");

    expect(invoke([42, "0x01", ["Hello"], "hello"])).toThrow(
      "Type Error: Expected proper value for fixed type"
    );
  });
});
