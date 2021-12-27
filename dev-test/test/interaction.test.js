import path from "path";
import { query, mutate } from "../../src";
import { emulator, init } from "flow-js-testing";
import { authorization } from "../utils";

// Increase timeout if your tests failing due to timeout
jest.setTimeout(10000);

describe("arguments - scripts", () => {
  beforeAll(async () => {
    const basePath = path.resolve(__dirname, "../cadence");
    // You can specify different port to parallelize execution of describe blocks
    const port = 8080;
    // Setting logging flag to true will pipe emulator output to console
    const logging = true;

    await init(basePath, { port, logging });
    return emulator.start(port);
  });

  // Stop emulator, so it could be restarted
  afterAll(async () => {
    return emulator.stop();
  });

  test("raw query output", async () => {
    const cadence = `
      pub struct Info{
        pub let message: String
        init(){
          self.message = "hello"
        }
      }
      pub fun main(): Info {
        return Info()
      }
    `;

    const [result] = await query({ cadence, raw: true });

    expect(result.type).toBe("Struct");
    expect(result.value.id.includes("Info")).toBe(true);
    expect(result.value.fields[0].name).toBe("message");
    expect(result.value.fields[0].value.type).toBe("String");
    expect(result.value.fields[0].value.value).toBe("hello");
  });

  it("shall work for transaction - once executed", async () => {
    const cadence = `
      transaction{
        prepare(singer: AuthAccount){
          log("all cool")
        }
      }
    `;
    const payer = authorization();
    const [txId, err] = await mutate({ cadence, payer, wait: null });
    console.log({ txId, err });
  });

  it("shall properly process Address: [UInt64] array", async ()=>{
    const cadence = `
      pub fun main(recipients: [Address], rewards: {Address: [UInt64]}) : Int{
        for address in recipients {
            if (rewards[address] != nil) {
              let userRewards = rewards[address] as! [UInt64]
              log(userRewards)
            }
        }
      }
      return 42
    `
    const args = [
      ["0x01", "0x02"],
      {
        "0x01": [1,2,3,4],
        "0x02": [3,4,5,6]
      }
    ]

    const [result,err] = await query({ cadence, args });
    console.log({result, err})
  })
});

describe("multiple interactions", ()=>{
  beforeAll(async () => {
    const basePath = path.resolve(__dirname, "../cadence");
    // You can specify different port to parallelize execution of describe blocks
    const port = 8080;
    // Setting logging flag to true will pipe emulator output to console
    const logging = true;

    await init(basePath, { port, logging });
    return emulator.start(port);
  });

  // Stop emulator, so it could be restarted
  afterAll(async () => {
    return emulator.stop();
  });

  it("shall properly handle multiple queries",async ()=>{
    const a = 42
    const [first, firstErr] = await query({
      cadence: `
        pub fun main(a: Int): Int { return a }
      `,
      args: [42]
    })
    // expect(first).toBe(a)
    console.log({first, firstErr})

    const [second, secondErr] = await query({
      cadence: `
        pub fun main(): UInt { return 42 }
      `
    })
    expect(second).toBe(42)

    console.log({second, secondErr})
  })
})
