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
        log(signer.address)
    }
}
`;

/**
* Method to generate cadence code for log transaction
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


/**
* Sends log transaction to the network
* @param {Object.<string, string>} props.addressMap - contract name as a key and address where it's deployed as value
* @param Array<*> props.args - list of arguments
* @param Array<*> props.signers - list of signers
*/
export const log = async (props) => {
  const { addressMap, args = [], signers = [] } = props;
  const code = await logTemplate(addressMap);

  reportMissing("arguments", args.length, 0, `log =>`);
  reportMissing("signers", signers.length, 1, `log =>`);

  return sendTransaction({code, ...props})
}