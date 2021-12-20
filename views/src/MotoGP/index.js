import {query, extendEnvironment} from "../../../src"

export const fetchMotoGPScript = `
    import MotoGPCard from 0x1
    import MotoGPCardMetadata from 0x2
    
    /*
    pub struct MotoGPCardData{
      pub let id: UInt64
      pub let name: String
      pub let image: String
      pub let url: String
      
      init(id: UInt64, name: String, image: String, url: String){
        self.id = id
        self.name = name
        self.image = image
        self.url = url
      }
    }
    */
    
    pub fun main(address: Address): [MotoGPCardMetadata.Metadata]{
      let account = getAccount(address)
      let motoGPCollection = account.getCapability<&MotoGPCard.Collection{MotoGPCard.ICardCollectionPublic}>(/public/motogpCardCollection)
      let motoGPNfts = motoGPCollection.borrow()!.getIDs()
      
      if(motoGPCollection.check()){
        let motoGPNfts = motoGPCollection.borrow()!.getIDs()
		    let items: [MotoGPCardMetadata.Metadata] = []
		    
		    for id in motoGPNfts {
          let nft = motoGPCollection.borrow()!.borrowCard(id: id)!
          let metadata = nft.getCardMetadata()!
          items.append(metadata)
		    }
		    
        return items
      } else {
        return []
      }
    }
  `;

export const MotoGPEnvironment = {
  mainnet: {
    "MotoGPCard":"0xa49cc0ee46c54bfb",
    "MotoGPCardMetadata":"0xa49cc0ee46c54bfb",
  },
};


export default (address) => {
  // Register addresses for contracts
  extendEnvironment(MotoGPEnvironment);

  return {
    name: "MotoGP",
    getData: async () => {
      const code = fetchMotoGPScript;
      const args = [address];
      return query({ code, args, processed: false });
    },
    mapData: (card) => {
      const { cardID: id, imageUrl: image, data: metadata } = card;
      const url = `https://motogp-ignition.com/nft/card/${id}?owner=${address}`
      return {
        id,
        image,
        url,
        metadata
      };
    },
  }
}