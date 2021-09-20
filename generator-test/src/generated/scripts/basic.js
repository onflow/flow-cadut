/** pragma type script **/

import {
  getEnvironment,
  replaceImportAddresses,
  reportMissingImports,
  reportMissing,
  executeScript
} from '../../../../src'

export const CODE = `
  import Basic from 0x1

pub fun main(): String{
    return Basic.message
}
`;

/**
* Method to generate cadence code for TestAsset
* @param {Object.<string, string>} addressMap - contract name as a key and address where it's deployed as value
*/
export const basicTemplate = async (addressMap = {}) => {
  const envMap = await getEnvironment();
  const fullMap = {
  ...envMap,
  ...addressMap,
  };

  // If there are any missing imports in fullMap it will be reported via console
  reportMissingImports(CODE, fullMap, `basic =>`)

  return replaceImportAddresses(CODE, fullMap);
};

export const basic = async (props) => {
  const { addressMap = {}, args = [] } = props
  const code = await basicTemplate(addressMap);

  reportMissing("arguments", args.length, 0, `basic =>`);

  return executeScript({code, ...props})
}