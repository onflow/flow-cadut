import { mapArgument } from "../src/args";
import { toFixedValue, withPrefix } from "../src/fixer";

describe("map arguments", () => {
  test("Int", async () => {
    const type = "Int";
    const value = 42;
    const output = mapArgument(type, value);

    expect(output.value).toBe(42);
    expect(output.type.label).toBe("Int");
  });

  test("Fix", async () => {
    const type = "Fix64";
    const value = 1.337;
    const output = mapArgument(type, value);

    expect(output.value).toBe(toFixedValue(value));
    expect(output.type.label).toBe(type);
  });

  test("String", async () => {
    const type = "String";
    const value = "Hello, Cadence";
    const output = mapArgument(type, value);

    expect(output.value).toBe(toFixedValue(value));
    expect(output.type.label).toBe(type);
  });

  test("Address - with prefix", async () => {
    const type = "Address";
    const value = "0x01";
    const output = mapArgument(type, value);

    expect(output.value).toBe(value);
    expect(output.type.label).toBe(type);
  });

  test("Address - with prefix", async () => {
    const type = "Address";
    const value = "01";
    const output = mapArgument(type, value);

    expect(output.value).toBe(withPrefix(value));
    expect(output.type.label).toBe(type);
  });

  test("Bool", async () => {
    const type = "Bool";
    const value = true;
    const output = mapArgument(type, value);

    expect(output.value).toBe(value);
    expect(output.type.label).toBe(type);
  });

  test("Array - Simple", async () => {
    throw "Not Implemented"
  })

  test("Dictionary - Simple", async () => {
    const type = "{String: String}";
    const value = {
      name: "Power",
      surname: "Rangers",
      country: "Japan",
    };
    const output = mapArgument(type, value);

    expect(output.type.label).toBe("Dictionary");
    expect(output.value.length).toBe(3);
    expect(output.value[0].key).toBe("name");
    expect(output.value[0].value.value).toBe("Power");
    expect(output.value[0].value.type.label).toBe("String");
  });
});
