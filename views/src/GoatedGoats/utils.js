export const pinataLink = id => `https://goatedgoats.mypinata.cloud/ipfs/${id}`

const RARITY_SCORES = {
  base: 10,
  common: 10,
  rare: 20,
  epic: 30,
  legendary: 45,
};

export const getRarityScore = (rarity) => {
  return RARITY_SCORES[rarity] || 10
}

const SCORE_PER_SLOT = 5
export const getGoatBaseScore = (rarity, traitSlots) =>{
  return getRarityScore(rarity) + (traitSlots * SCORE_PER_SLOT)
}