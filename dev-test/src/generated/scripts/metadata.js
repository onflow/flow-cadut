/** pragma type script **/

import {
  getEnvironment,
  replaceImportAddresses,
  reportMissingImports,
  reportMissing,
  executeScript
} from '../../../../src'

export const CODE = `
  pub fun main(metadata: {String:String}): String{
    let name = metadata["name"]!
    return name
}
`;

/**
* Method to generate cadence code for TestAsset
* @param {Object.<string, string>} addressMap - contract name as a key and address where it's deployed as value
*/
export const metadataTemplate = async (addressMap = {}) => {
  const envMap = await getEnvironment();
  const fullMap = {
  ...envMap,
  ...addressMap,
  };

  // If there are any missing imports in fullMap it will be reported via console
  reportMissingImports(CODE, fullMap, `metadata =>`)

  return replaceImportAddresses(CODE, fullMap);
};

export const metadata = async (props) => {
  const { addressMap = {}, args = [] } = props
  const code = await metadataTemplate(addressMap);

  reportMissing("arguments", args.length, 1, `metadata =>`);

  return executeScript({code, ...props})
}