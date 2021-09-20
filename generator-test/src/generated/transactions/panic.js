/** pragma type transaction **/

import {
  getEnvironment,
  replaceImportAddresses,
  reportMissingImports,
  reportMissing,
  sendTransaction
} from '../../../../src'

export const CODE = `
  transaction{
    prepare(signer: AuthAccount){
        panic("Uh-oh!")
    }
}
`;

/**
* Method to generate cadence code for panic transaction
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


/**
* Sends panic transaction to the network
* @param {Object.<string, string>} props.addressMap - contract name as a key and address where it's deployed as value
* @param Array<*> props.args - list of arguments
* @param Array<*> props.signers - list of signers
*/
export const panic = async (props) => {
  const { addressMap, args = [], signers = [] } = props;
  const code = await panicTemplate(addressMap);

  reportMissing("arguments", args.length, 0, `panic =>`);
  reportMissing("signers", signers.length, 1, `panic =>`);

  return sendTransaction({code, ...props})
}