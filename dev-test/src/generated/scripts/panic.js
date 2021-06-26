/** pragma type script **/

import {
  getEnvironment,
  replaceImportAddresses,
  reportMissingImports,
  reportMissing,
  executeScript
} from '../../../../src'

export const CODE = `
  pub fun main(){
    panic("Nope!")
}
`;

/**
* Method to generate cadence code for TestAsset
* @param {Object.<string, string>} addressMap - contract name as a key and address where it's deployed as value
*/
export const panicTemplate = async (addressMap = {}) => {
  const envMap = await getEnvironment();
  const fullMap = {
  ...envMap,
  ...addressMap,
  };

  // If there are any missing imports in fullMap it will be reported via console
  reportMissingImports(CODE, fullMap, `panic =>`)

  return replaceImportAddresses(CODE, fullMap);
};

export const panic = async (props) => {
  const { addressMap = {}, args = [] } = props
  const code = await panicTemplate(addressMap);

  reportMissing("arguments", args.length, 0, `panic =>`);

  return executeScript({code, ...props})
}