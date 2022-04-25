import { query, extendEnvironment } from "../../../src";
import { GoatedGoatsEnvironment } from "./env";
import { getRarityScore, pinataLink } from "./utils";

export const fetchTraits = `
  import GoatedGoatsTrait from 0x01

  pub struct TraitsData{
    pub let id: UInt64
    pub let metadata: {String: String}
    init(_ id: UInt64, _ metadata: {String:String}){
      self.id = id
      self.metadata = metadata
    }
  }

  pub fun main(address: Address):[TraitsData]{
    var traitsData: [TraitsData] = []
    let account = getAccount(address)
    
        if let collection = account.getCapability(GoatedGoatsTrait.CollectionPublicPath).borrow<&{GoatedGoatsTrait.TraitCollectionPublic}>()  {
        for id in collection.getIDs() {
          if let trait = collection.borrowTrait(id: id){
            let metadata = trait.getMetadata()
            traitsData.append(
              TraitsData(id, metadata)
            )   
          }
        }
    }
    return traitsData
  }
`;

export default (address) => {
  // Register addresses for contracts
  extendEnvironment(GoatedGoatsEnvironment);

  const code = fetchTraits;
  const args = [address];

  return {
    name: "GoatedTraits",
    getData: () => {
      return query({
        code,
        args,
        processed: false,
      });
    },
    mapData: (goat) => {
      const { id, metadata } = goat;
      const { thumbnailCID } = metadata;
      const image = pinataLink(thumbnailCID);
      const rarityScore = getRarityScore(metadata.rarity)
      return {
        id,
        metadata,
        image,
        rarityScore
      };
    },
  };
};
