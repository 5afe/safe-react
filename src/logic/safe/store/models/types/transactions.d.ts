export enum Operation {
  CALL,
  DELEGATE_CALL,
  CREATE,
}

// types comes from: https://github.com/gnosis/safe-client-gateway/blob/752e76b6d1d475791dbd7917b174bb41d2d9d8be/src/utils.rs
export enum TransferMethods {
  TRANSFER = 'transfer',
  TRANSFER_FROM = 'transferFrom',
  SAFE_TRANSFER_FROM = 'safeTransferFrom',
}

export enum SettingsChangeMethods {
  SETUP = 'setup',
  SET_FALLBACK_HANDLER = 'setFallbackHandler',
  ADD_OWNER_WITH_THRESHOLD = 'addOwnerWithThreshold',
  REMOVE_OWNER = 'removeOwner',
  REMOVE_OWNER_WITH_THRESHOLD = 'removeOwnerWithThreshold',
  SWAP_OWNER = 'swapOwner',
  CHANGE_THRESHOLD = 'changeThreshold',
  CHANGE_MASTER_COPY = 'changeMasterCopy',
  ENABLE_MODULE = 'enableModule',
  DISABLE_MODULE = 'disableModule',
  EXEC_TRANSACTION_FROM_MODULE = 'execTransactionFromModule',
  APPROVE_HASH = 'approveHash',
  EXEC_TRANSACTION = 'execTransaction',
}

// note: this extends SAFE_METHODS_NAMES in /logic/contracts/methodIds.ts, we need to figure out which one we are going to use
export type DataDecodedMethod = TransferMethods | SettingsChangeMethods | string

export interface ValueDecoded {
  operation: Operation
  to: string
  value: number
  data: string
  dataDecoded: DataDecoded
}

export interface SingleTransactionMethodParameter {
  name: string
  type: string
  value: string
}

export interface MultiSendMethodParameter extends SingleTransactionMethodParameter {
  valueDecoded: ValueDecoded[]
}

export type Parameter = MultiSendMethodParameter | SingleTransactionMethodParameter

export interface DataDecoded {
  method: DataDecodedMethod
  parameters: Parameter[]
}

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
  ENABLE_MODULE: 'enableModule',
  DISABLE_MODULE: 'disableModule',
} as const

export const SAFE_METHOD_ID_TO_NAME = {
  '0xe318b52b': SAFE_METHODS_NAMES.SWAP_OWNER,
  '0x0d582f13': SAFE_METHODS_NAMES.ADD_OWNER_WITH_THRESHOLD,
  '0xf8dc5dd9': SAFE_METHODS_NAMES.REMOVE_OWNER,
  '0x694e80c3': SAFE_METHODS_NAMES.CHANGE_THRESHOLD,
  '0x610b5925': SAFE_METHODS_NAMES.ENABLE_MODULE,
  '0xe009cfde': SAFE_METHODS_NAMES.DISABLE_MODULE,
} as const

export const SPENDING_LIMIT_METHODS_NAMES = {
  ADD_DELEGATE: 'addDelegate',
  SET_ALLOWANCE: 'setAllowance',
  EXECUTE_ALLOWANCE_TRANSFER: 'executeAllowanceTransfer',
  DELETE_ALLOWANCE: 'deleteAllowance',
} as const

export const SPENDING_LIMIT_METHOD_ID_TO_NAME = {
  '0xe71bdf41': SPENDING_LIMIT_METHODS_NAMES.ADD_DELEGATE,
  '0xbeaeb388': SPENDING_LIMIT_METHODS_NAMES.SET_ALLOWANCE,
  '0x4515641a': SPENDING_LIMIT_METHODS_NAMES.EXECUTE_ALLOWANCE_TRANSFER,
  '0x885133e3': SPENDING_LIMIT_METHODS_NAMES.DELETE_ALLOWANCE,
} as const

export type SafeMethods = typeof SAFE_METHODS_NAMES[keyof typeof SAFE_METHODS_NAMES]

export const TOKEN_TRANSFER_METHODS_NAMES = {
  TRANSFER: 'transfer',
  TRANSFER_FROM: 'transferFrom',
  SAFE_TRANSFER_FROM: 'safeTransferFrom',
} as const

export const TOKEN_TRANSFER_METHOD_ID_TO_NAME = {
  '0xa9059cbb': TOKEN_TRANSFER_METHODS_NAMES.TRANSFER,
  '0x23b872dd': TOKEN_TRANSFER_METHODS_NAMES.TRANSFER_FROM,
  '0x42842e0e': TOKEN_TRANSFER_METHODS_NAMES.SAFE_TRANSFER_FROM,
} as const

type TokenMethods = typeof TOKEN_TRANSFER_METHODS_NAMES[keyof typeof TOKEN_TRANSFER_METHODS_NAMES]

export type SafeDecodedParams = {
  [key in SafeMethods]?: Record<string, string>
}

export type TokenDecodedParams = {
  [key in TokenMethods]?: Record<string, string>
}

export type DecodedParams = SafeDecodedParams | TokenDecodedParams | null
