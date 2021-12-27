import { query, extendEnvironment } from "../../../src";

export const fetchBallerzScript = `
  import Gaia from 0xGaia
  
  pub fun main(address: Address): [{String: String}]{
    let account = getAccount(address)
    let gaiaCollection = account.getCapability<&{Gaia.CollectionPublic}>(Gaia.CollectionPublicPath)
    let gaiaNfts = gaiaCollection.borrow()!.getIDs()
    let items: [{String: String}] = []
    
    for id in gaiaNfts {
      let nft = gaiaCollection.borrow()!.borrowGaiaNFT(id: id)!
      let metadata = Gaia.getTemplateMetaData(templateID: nft.data.templateID)!
      items.append(metadata)
    }
    
    return items
  }
`;

export const GaiaEnvironment = {
  name: "Gaia",
  mainnet: "0x8b148183c28ff88f",
  testnet: "",
};

export default (address) => {
  extendEnvironment(GaiaEnvironment);

  const resolvedAddress = address;
  const code = fetchBallerzScript;
  const args = [resolvedAddress];
  return {
    name: "Ballerz",
    getData: () => {
      return query({
        code,
        args,
        processed: false,
      });
    },
    mapData: (baller) => {
      const { id, img, ...metadata } = baller;
      const ipfsUrl = img.slice(7).replace(/\//g, "%2F");
      const image = `https://ongaia.com/_next/image?url=https%3A%2F%2Fimages.ongaia.com%2Fipfs%2F${ipfsUrl}&w=3840&q=75`;
      return {
        id,
        metadata,
        image,
      };
    },
  };
};
