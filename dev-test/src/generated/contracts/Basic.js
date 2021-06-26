/** pragma type contract **/

import {
  getEnvironment,
  replaceImportAddresses,
  reportMissingImports,
  deployContract,
} from '../../../../src'

export const CODE = `
  pub contract Basic{
    pub let message: String
    init(){
        log("Basic deployed")
        self.message = "Hello, Cadence!"
    }
}
`;

/**
* Method to generate cadence code for Basic transaction
* @param {Object.<string, string>} addressMap - contract name as a key and address where it's deployed as value
*/
export const BasicTemplate = async (addressMap = {}) => {
  const envMap = await getEnvironment();
  const fullMap = {
  ...envMap,
  ...addressMap,
  };

  // If there are any missing imports in fullMap it will be reported via console
  reportMissingImports(CODE, fullMap, `Basic =>`)

  return replaceImportAddresses(CODE, fullMap);
};


/**
* Deploys Basic transaction to the network
* @param {Object.<string, string>} addressMap - contract name as a key and address where it's deployed as value
* @param Array<*> args - list of arguments
* param Array<string> - list of signers
*/
export const  deployBasic = async (props) => {
  const { addressMap = {} } = props;
  const code = await BasicTemplate(addressMap);
  const name = "Basic"

  return deployContract({ code, name, ...props })
}