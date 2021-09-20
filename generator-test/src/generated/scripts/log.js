/** pragma type script **/

import {
  getEnvironment,
  replaceImportAddresses,
  reportMissingImports,
  reportMissing,
  executeScript
} from '../../../../src'

export const CODE = `
  pub fun main(message: String): Int{
    log(message)
    return 42
}
`;

/**
* Method to generate cadence code for TestAsset
* @param {Object.<string, string>} addressMap - contract name as a key and address where it's deployed as value
*/
export const logTemplate = async (addressMap = {}) => {
  const envMap = await getEnvironment();
  const fullMap = {
  ...envMap,
  ...addressMap,
  };

  // If there are any missing imports in fullMap it will be reported via console
  reportMissingImports(CODE, fullMap, `log =>`)

  return replaceImportAddresses(CODE, fullMap);
};

export const log = async (props) => {
  const { addressMap = {}, args = [] } = props
  const code = await logTemplate(addressMap);

  reportMissing("arguments", args.length, 1, `log =>`);

  return executeScript({code, ...props})
}