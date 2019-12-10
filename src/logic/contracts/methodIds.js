// @flow
import { getWeb3 } from '~/logic/wallets/getWeb3'

// SAFE METHODS TO ITS ID
// https://github.com/gnosis/safe-contracts/blob/development/test/safeMethodNaming.js
// https://github.com/gnosis/safe-contracts/blob/development/contracts/GnosisSafe.sol
//  [
//   { name: "addOwnerWithThreshold", id: "0x0d582f13" },
//   { name: "DOMAIN_SEPARATOR_TYPEHASH", id: "0x1db61b54" },
//   { name: "isOwner", id: "0x2f54bf6e" },
//   { name: "execTransactionFromModule", id: "0x468721a7" },
//   { name: "signedMessages", id: "0x5ae6bd37" },
//   { name: "enableModule", id: "0x610b5925" },
//   { name: "changeThreshold", id: "0x694e80c3" },
//   { name: "approvedHashes", id: "0x7d832974" },
//   { name: "changeMasterCopy", id: "0x7de7edef" },
//   { name: "SENTINEL_MODULES", id: "0x85e332cd" },
//   { name: "SENTINEL_OWNERS", id: "0x8cff6355" },
//   { name: "getOwners", id: "0xa0e67e2b" },
//   { name: "NAME", id: "0xa3f4df7e" },
//   { name: "nonce", id: "0xaffed0e0" },
//   { name: "getModules", id: "0xb2494df3" },
//   { name: "SAFE_MSG_TYPEHASH", id: "0xc0856ffc" },
//   { name: "SAFE_TX_TYPEHASH", id: "0xccafc387" },
//   { name: "disableModule", id: "0xe009cfde" },
//   { name: "swapOwner", id: "0xe318b52b" },
//   { name: "getThreshold", id: "0xe75235b8" },
//   { name: "domainSeparator", id: "0xf698da25" },
//   { name: "removeOwner", id: "0xf8dc5dd9" },
//   { name: "VERSION", id: "0xffa1ad74" },
//   { name: "setup", id: "0xa97ab18a" },
//   { name: "execTransaction", id: "0x6a761202" },
//   { name: "requiredTxGas", id: "0xc4ca3a9c" },
//   { name: "approveHash", id: "0xd4d9bdcd" },
//   { name: "signMessage", id: "0x85a5affe" },
//   { name: "isValidSignature", id: "0x20c13b0b" },
//   { name: "getMessageHash", id: "0x0a1028c4" },
//   { name: "encodeTransactionData", id: "0xe86637db" },
//   { name: "getTransactionHash", id: "0xd8d11f78" }
// ]

const METHOD_TO_ID = {
  '0xe318b52b': 'swapOwner',
  '0x0d582f13': 'addOwnerWithThreshold',
  '0xf8dc5dd9': 'removeOwner',
  '0x694e80c3': 'changeThreshold',
}

export const decodeParamsFromSafeMethod = async (data: string) => {
  const web3 = await getWeb3()
  const [methodId, params] = [data.slice(0, 10), data.slice(10)]

  switch (methodId) {
    // swapOwner
    case '0xe318b52b':
      return {
        methodName: METHOD_TO_ID[methodId],
        args: web3.eth.abi.decodeParameters(['uint', 'address', 'address'], params),
      }

    // addOwnerWithThreshold
    case '0x0d582f13':
      return {
        methodName: METHOD_TO_ID[methodId],
        args: web3.eth.abi.decodeParameters(['address', 'uint'], params),
      }

    // removeOwner
    case '0xf8dc5dd9':
      return {
        methodName: METHOD_TO_ID[methodId],
        args: web3.eth.abi.decodeParameters(['address', 'address', 'uint'], params),
      }

    // changeThreshold
    case '0x694e80c3':
      return {
        methodName: METHOD_TO_ID[methodId],
        args: web3.eth.abi.decodeParameters(['uint'], params),
      }

    default:
      return {}
  }
}
