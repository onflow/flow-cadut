import { parsePath } from "../src/fixer";

describe("fixer", () => {
  it("shall parse proper path - public", () => {
    const domain = "public";
    const identifier = "collection";
    const input = `/${domain}/${identifier}`;
    const output = parsePath(input);
    expect(typeof output).toBe("object");
    expect(Object.keys(output).length).toBe(2);
    expect(output.domain).toBe(domain);
    expect(output.identifier).toBe(identifier);
  });

  it("shall parse proper path - private", () => {
    const domain = "private";
    const identifier = "collection";
    const input = `/${domain}/${identifier}`;
    const output = parsePath(input);
    expect(typeof output).toBe("object");
    expect(Object.keys(output).length).toBe(2);
    expect(output.domain).toBe(domain);
    expect(output.identifier).toBe(identifier);
  });

  it("shall parse proper path - storage", () => {
    const domain = "private";
    const identifier = "collection";
    const input = `/${domain}/${identifier}`;
    const output = parsePath(input);
    expect(typeof output).toBe("object");
    expect(Object.keys(output).length).toBe(2);
    expect(output.domain).toBe(domain);
    expect(output.identifier).toBe(identifier);
  });

  it("shall throw error on incorrect path", () => {
    const input = `this-shall-not-pass`;
    expect(() => {
      parsePath(input);
    }).toThrow("Incorrect Path - shall start with `/`");
  });

  it("shall throw error on incorrect path - missing identifier", () => {
    const input = `/public`;
    expect(() => {
      parsePath(input);
    }).toThrow("Incorrect Path - identifier missing");
  });

  it("shall throw error on incorrect path - wrong domain", () => {
    const input = `/planet/Mars`;
    expect(() => {
      parsePath(input);
    }).toThrow("Incorrect Path - wrong domain");
  });
});
