import { query,extendEnvironment } from "../../../src";

export const fetchFlovatarsScript = `
    import Flovatar from 0xFlovatar
    
    pub fun main(address: Address): [Flovatar.FlovatarData]{
      return Flovatar.getFlovatars(address: address)
    }
  `;

export const FlovatarEnvironment = {
  name: "Flovatar",
  mainnet: "0x921ea449dffec68a",
  testnet: "0x0cf264811b95d465",
};

export default (address) => {
  // Register addresses for contracts
  extendEnvironment(FlovatarEnvironment);

  const resolvedAddress = address;
  const code = fetchFlovatarsScript;
  const args = [address];
  return {
    name: "Flovatar",
    getData: () => {
      return query({
        code,
        args,
        processed: false
      });
    },
    mapData: (flovatar) => {
      const { id, metadata } = flovatar;
      const image = `https://flovatar.com/api/image/${id}`;
      const url = `https://flovatar.com/flovatars/${id}/${resolvedAddress}`;
      return {
        id,
        metadata,
        image,
        url,
      };
    },
  };
};
