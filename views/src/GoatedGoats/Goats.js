import { query, extendEnvironment } from "../../../src";
import {GoatedGoatsEnvironment} from "./env";

export const fetchGoats = `
  import GoatedGoats from 0x01
  
  pub struct GoatData{
    pub let id: UInt64
    pub let metadata: {String: String}
    pub let traitSlots: UInt8?
    pub let creationDate: UFix64
    
    init(
      id: UInt64, 
      metadata: {String: String}, 
      traitSlots: UInt8?, 
      creationDate: UFix64
    ){
      self.id = id
      self.metadata = metadata
      self.traitSlots = traitSlots
      self.creationDate = creationDate
    }
  }
  
  pub fun main(address: Address): [GoatData]{
    var goatsData: [GoatData] = []
    let account = getAccount(address)

    if let collection = account.getCapability(GoatedGoats.CollectionPublicPath).borrow<&{GoatedGoats.GoatCollectionPublic}>()  {
      for id in collection.getIDs() {
        if let goat = collection.borrowGoat(id: id){
          let metadata = goat.getMetadata()
          let traitSlots = goat.getTraitSlots()
          goatsData.append(
            GoatData(
              id: goat.goatID,
              metadata: metadata,
              traitSlots: traitSlots,
              creationDate: goat.goatCreationDate
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
      const { id, metadata, creationDate: timestamp } = goat
      const { thumbnailCID } = metadata;
      const pinataCloud = 'https://goatedgoats.mypinata.cloud/ipfs'
      const image = `${pinataCloud}/${thumbnailCID}`;
      const creationDate = parseInt(timestamp)*1000
      return {
        id,
        metadata,
        image,
        creationDate
      };
    },
  };
};
