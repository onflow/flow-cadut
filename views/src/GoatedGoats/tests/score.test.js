import { getGoatBaseScore } from "../utils";

describe("test rarity score", () => {
  it("shall properly calculate rare score",()=>{
    const rarity ="rare"
    const traitSlots = 7
    const correctScore = 55
    const calculatedScore = getGoatBaseScore(rarity, traitSlots);
    expect(calculatedScore).toBe(correctScore);
  })
  it("shall properly calculate scores", () => {
    const cases = [
      {
        rarity: "base",
        traitSlots: 5,
        correctScore: 35,
      },
      {
        rarity: "common",
        traitSlots: 5,
        correctScore: 35,
      },
      {
        rarity: "rare",
        traitSlots: 5,
        correctScore: 45,
      },
      {
        rarity: "rare",
        traitSlots: 7,
        correctScore: 55,
      },
      {
        rarity: "epic",
        traitSlots: 5,
        correctScore: 55,
      },
      {
        rarity: "legendary",
        traitSlots: 5,
        correctScore: 70,
      },
      {
        rarity: "legendary",
        traitSlots: 9,
        correctScore: 90,
      },
    ];

    for (let i = 0; i < cases.length; i++) {
      const { rarity, traitSlots, correctScore } = cases[i];
      const calculatedScore = getGoatBaseScore(rarity, traitSlots);
      expect(calculatedScore).toBe(correctScore);
    }
  });
});
