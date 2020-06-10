import { web3ReadOnly as web3 } from 'src/logic/wallets/getWeb3'

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

export const SAFE_METHODS_NAMES = {
  ADD_OWNER_WITH_THRESHOLD: 'addOwnerWithThreshold',
  CHANGE_THRESHOLD: 'changeThreshold',
  REMOVE_OWNER: 'removeOwner',
  SWAP_OWNER: 'swapOwner',
}

const METHOD_TO_ID = {
  '0xe318b52b': SAFE_METHODS_NAMES.SWAP_OWNER,
  '0x0d582f13': SAFE_METHODS_NAMES.ADD_OWNER_WITH_THRESHOLD,
  '0xf8dc5dd9': SAFE_METHODS_NAMES.REMOVE_OWNER,
  '0x694e80c3': SAFE_METHODS_NAMES.CHANGE_THRESHOLD,
}

type SafeMethods = typeof SAFE_METHODS_NAMES[keyof typeof SAFE_METHODS_NAMES]
type TokenMethods = 'transfer' | 'transferFrom' | 'safeTransferFrom'

type DecodedValues = Array<{
  name: string
  type?: string
  value: string
}>

type SafeDecodedParams = {
  [key in SafeMethods]?: DecodedValues
}

type TokenDecodedParams = {
  [key in TokenMethods]?: DecodedValues
}

export type DecodedMethods = SafeDecodedParams | TokenDecodedParams | null

export interface DataDecoded {
  method: SafeMethods | TokenMethods
  parameters: DecodedValues
}

export const decodeParamsFromSafeMethod = (data: string): DataDecoded | null => {
  const [methodId, params] = [data.slice(0, 10) as keyof typeof METHOD_TO_ID | string, data.slice(10)]

  switch (methodId) {
    // swapOwner
    case '0xe318b52b': {
      const decodedParameters = web3.eth.abi.decodeParameters(['uint', 'address', 'address'], params)
      return {
        method: METHOD_TO_ID[methodId],
        parameters: [
          { name: 'oldOwner', value: decodedParameters[1] },
          { name: 'newOwner', value: decodedParameters[2] },
        ],
      }
    }

    // addOwnerWithThreshold
    case '0x0d582f13': {
      const decodedParameters = web3.eth.abi.decodeParameters(['address', 'uint'], params)
      return {
        method: METHOD_TO_ID[methodId],
        parameters: [
          { name: 'owner', value: decodedParameters[0] },
          { name: '_threshold', value: decodedParameters[1] },
        ],
      }
    }

    // removeOwner
    case '0xf8dc5dd9': {
      const decodedParameters = web3.eth.abi.decodeParameters(['address', 'address', 'uint'], params)
      return {
        method: METHOD_TO_ID[methodId],
        parameters: [
          { name: 'oldOwner', value: decodedParameters[1] },
          { name: '_threshold', value: decodedParameters[2] },
        ],
      }
    }

    // changeThreshold
    case '0x694e80c3': {
      const decodedParameters = web3.eth.abi.decodeParameters(['uint'], params)
      return {
        method: METHOD_TO_ID[methodId],
        parameters: [
          { name: '_threshold', value: decodedParameters[0] },
        ],
      }
    }

    default:
      return null
  }
}

const isSafeMethod = (methodId: string): boolean => {
  return !!METHOD_TO_ID[methodId]
}

export const decodeMethods = (data: string): DataDecoded | null => {
  const [methodId, params] = [data.slice(0, 10), data.slice(10)]

  if (isSafeMethod(methodId)) {
    return decodeParamsFromSafeMethod(data)
  }

  switch (methodId) {
    // a9059cbb - transfer(address,uint256)
    case '0xa9059cbb': {
      const decodeParameters = web3.eth.abi.decodeParameters(['address', 'uint'], params)
      return {
        method: 'transfer',
        parameters: [
          { name: 'to', value: decodeParameters[0] },
          { name: 'value', value: decodeParameters[1] },
        ],
      }
    }

    // 23b872dd - transferFrom(address,address,uint256)
    case '0x23b872dd': {
      const decodeParameters = web3.eth.abi.decodeParameters(['address', 'address', 'uint'], params)
      return {
        method: 'transferFrom',
        parameters: [
          { name: 'from', value: decodeParameters[0] },
          { name: 'to', value: decodeParameters[1] },
          { name: 'value', value: decodeParameters[2] },
        ],
      }
    }

    // 42842e0e - safeTransferFrom(address,address,uint256)
    case '0x42842e0e': {
      const decodedParameters = web3.eth.abi.decodeParameters(['address', 'address', 'uint'], params)
      return {
        method: 'safeTransferFrom',
        parameters: [
          { name: 'from', value: decodedParameters[0] },
          { name: 'to', value: decodedParameters[1] },
          { name: 'value', value: decodedParameters[2] },
        ],
      }
    }

    default:
      return null
  }
}
