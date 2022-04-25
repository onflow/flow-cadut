import { query, extendEnvironment } from "../../../src";
import { GoatedGoatsEnvironment } from "./env";
import { getGoatBaseScore, getRarityScore, pinataLink } from "./utils";

export const fetchGoats = `
  import GoatedGoats from 0x01
  
  pub struct GoatData{
    pub let id: UInt64
    pub let metadata: {String: String}
    pub let traitSlots: UInt8?
    pub let creationDate: UFix64
    pub let equippedTraits: [{String: AnyStruct}]
    init(
      id: UInt64, 
      metadata: {String: String}, 
      traitSlots: UInt8?, 
      creationDate: UFix64,
      equippedTraits: [{String: AnyStruct}]
    ){
      self.id = id
      self.metadata = metadata
      self.traitSlots = traitSlots
      self.creationDate = creationDate
      self.equippedTraits = equippedTraits
    }
  }
  
  pub fun main(address: Address): [GoatData]{
    var goatsData: [GoatData] = []
    let account = getAccount(address)

    if let collection = account.getCapability(GoatedGoats.CollectionPublicPath).borrow<&{GoatedGoats.GoatCollectionPublic}>()  {
      for id in collection.getIDs() {
        if let goat = collection.borrowGoat(id: id){
        
          // Gather data from NFT
          let metadata = goat.getMetadata()
          let traitSlots = goat.getTraitSlots()
          let creationDate = goat.goatCreationDate
          let equippedTraits = goat.getEquippedTraits()
        
          // Store it for later return
          goatsData.append(
            GoatData(
              id: goat.goatID,
              metadata: metadata,
              traitSlots: traitSlots,
              creationDate: creationDate,
              equippedTraits: equippedTraits
            )
          )
        }
      }
    }
    return goatsData
  }
`;

export default (address) => {
  // Register addresses for contracts
  extendEnvironment(GoatedGoatsEnvironment);

  // const resolvedAddress = address;
  const code = fetchGoats;
  const args = [address];

  return {
    name: "GoatedGoats",
    getData: () => {
      return query({
        code,
        args,
        processed: false,
      });
    },
    mapData: (goat) => {
      const { id, metadata, creationDate: timestamp, traitSlots } = goat;
      const { thumbnailCID, skinRarity } = metadata;
      const image = pinataLink(thumbnailCID);
      const creationDate = parseInt(timestamp) * 1000;
      const skinScore = getGoatBaseScore(skinRarity, traitSlots);

      let traitsScore = 0;
      const equippedTraits = goat.equippedTraits.map((trait) => {
        const { traitID: id, traitEditionMetadata: metadata } = trait;
        const { rarity, thumbnailCID } = metadata;
        const score = getRarityScore(rarity);
        traitsScore += score;
        return {
          id,
          image: pinataLink(thumbnailCID),
          traitScore: score,
          metadata,
        };
      });

      return {
        id,
        metadata,
        image,
        creationDate,
        equippedTraits,
        skinScore,
        traitsScore,
        traitSlots,
      };
    },
  };
};
