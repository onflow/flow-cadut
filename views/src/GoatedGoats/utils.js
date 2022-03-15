export const pinataLink = id => `https://goatedgoats.mypinata.cloud/ipfs/${id}`

export const getRarityScore = (rarity) => {
  switch (rarity){
    case "legendary":
      return 45
    case "epic":
      return 30
    case "rare":
      return 20
    case "common":
    case "base":
    default:
      return 10
  }
}

const SCORE_PER_SLOT = 5
export const getGoatBaseScore = (rarity, traitSlots) =>{
  return getRarityScore(rarity) + (traitSlots * SCORE_PER_SLOT)
}