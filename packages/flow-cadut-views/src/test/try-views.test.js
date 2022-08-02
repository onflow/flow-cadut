import {setEnvironment} from "@onflow/flow-cadut"
import {
  Flovatars,
  VersusArt,
  MotoGP,
  Ballerz,
  GoatedGoats,
  GoatedTraits,
  getView,
  getDisplay,
} from ".."

describe("views", () => {
  it("fetch flowvatars", async () => {
    await setEnvironment("mainnet")
    const [flowvatars, err] = await getView(Flovatars, "0x886f3aeaf848c535")
    expect(flowvatars).toBeTruthy()
    expect(err).toBeNull()
  })

  it("fetch versus art", async () => {
    await setEnvironment("mainnet")
    const [art, err] = await getView(VersusArt, "0x886f3aeaf848c535")
    expect(art).toBeTruthy()
    expect(err).toBeNull()
  })

  it("fetch motogp", async () => {
    await setEnvironment("mainnet")
    const [cards, err] = await getView(MotoGP, "0x53f389d96fb4ce5e")
    expect(cards).toBeTruthy()
    expect(err).toBeNull()
  })

  it("fetch ballerz", async () => {
    await setEnvironment("mainnet")
    const [ballerz, err] = await getView(Ballerz, "0x4c342b6dafb5bcb1")
    expect(ballerz).toBeTruthy()
    expect(err).toBeNull()
  })

  it("fetch goats", async () => {
    await setEnvironment("mainnet")
    const [goats, err] = await getView(GoatedGoats, "0x309c72eaa414cdc5")
    expect(goats).toBeTruthy()
    expect(err).toBeNull()
  })

  it("fetch goated traits", async () => {
    await setEnvironment("mainnet")
    const [traits, err] = await getView(GoatedTraits, "0x309c72eaa414cdc5")
    expect(traits).toBeTruthy()
    expect(err).toBeNull()
  })
})

describe("displays", () => {
  it("shall fetch multiple panels at once", async () => {
    await setEnvironment("mainnet")
    const display = await getDisplay(
      [Flovatars, VersusArt],
      "0x886f3aeaf848c535"
    )
    expect(display.Flovatar).not.toBe(null)
    expect(display.VersusArt).not.toBe(null)
  })

  it("shall fire changes asynchronously", async () => {
    await setEnvironment("mainnet")

    const resolved = {}

    const views = [Flovatars, VersusArt, Ballerz]
    const owner = "0x886f3aeaf848c535"
    const onChange = name => {
      resolved[name] = true
    }
    const display = await getDisplay(views, owner, onChange)
    expect(display.Flovatar).not.toBe(null)
    expect(display.VersusArt).not.toBe(null)
    expect(display.Ballerz).not.toBe(null)

    expect(resolved.Flovatar).toBe(true)
    expect(resolved.VersusArt).toBe(true)
    expect(resolved.Ballerz).toBe(true)
  })
})
