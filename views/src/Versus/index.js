import { query,extendEnvironment } from "../../../src";

export const fetchVersusArtScript = `
  import Art from 0xArt
  
  pub struct ArtData{
    pub let id: UInt64
    pub let name: String
     
    init(id: UInt64, name: String){
      self.id = id
      self.name = name
    }
  }
  
  pub fun main(address: Address):[Art.ArtData]{
  	return Art.getArt(address: address)
  }
`;

export const VersusEnvironment = {
  name: "Art",
  mainnet: "0xd796ff17107bbff6",
  testnet: "0x99ca04281098b33d",
};

const versusImageUrlPrefix =
  "https://res.cloudinary.com/dxra4agvf/image/upload/c_fill,w_600/f_auto/maincache";

export default (address) => {
  // Register addresses for contracts
  extendEnvironment(VersusEnvironment);

  return {
    name: "VersusArt",
    getData: async () => {
      const code = fetchVersusArtScript;
      const args = [address];
      return query({ code, args, processed: false });
    },
    mapData: (artwork) => {
      const { id, cacheKey, metadata } = artwork;
      const image = versusImageUrlPrefix + cacheKey;
      const url = `https://www.versus.auction/piece/${address}/${id}/`;
      const name = `${metadata.name} edition ${metadata.edition}/${metadata.maxEdition} by ${metadata.artist}`;
      return {
        id,
        image,
        url,
        name,
        metadata,
      };
    },
  };
};
