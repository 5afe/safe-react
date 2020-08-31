export enum TxConstants {
  MULTI_SEND = 'multiSend',
  UNKNOWN = 'UNKNOWN',
}

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

export enum ConfirmationType {
  CONFIRMATION = 'CONFIRMATION',
  EXECUTION = 'EXECUTION',
}

export enum SignatureType {
  CONTRACT_SIGNATURE = 'CONTRACT_SIGNATURE',
  APPROVED_HASH = 'APPROVED_HASH',
  EOA = 'EOA',
  ETH_SIGN = 'ETH_SIGN',
}

export interface Confirmation {
  owner: string
  submissionDate: string
  transactionHash: string | null
  confirmationType: ConfirmationType
  signature: string
  signatureType: SignatureType
}

export enum TokenType {
  ERC20 = 'ERC20',
  ERC721 = 'ERC721',
  OTHER = 'OTHER',
}

export interface TokenInfo {
  type: TokenType
  address: string
  name: string
  symbol: string
  decimals: number
  logoUri: string
}

export enum TransferType {
  ETHER_TRANSFER = 'ETHER_TRANSFER',
  ERC20_TRANSFER = 'ERC20_TRANSFER',
  ERC721_TRANSFER = 'ERC721_TRANSFER',
  UNKNOWN = 'UNKNOWN',
}

export interface Transfer {
  type: TransferType
  executionDate: string
  blockNumber: number
  transactionHash: string | null
  to: string
  value: string | null
  tokenId: string | null
  tokenAddress: string
  tokenInfo: TokenInfo | null
  from: string
}

export enum TxType {
  MULTISIG_TRANSACTION = 'MULTISIG_TRANSACTION',
  ETHEREUM_TRANSACTION = 'ETHEREUM_TRANSACTION',
  MODULE_TRANSACTION = 'MODULE_TRANSACTION',
}

export interface MultiSigTransaction {
  safe: string
  to: string
  value: string
  data: string | null
  operation: number
  gasToken: string
  safeTxGas: number
  baseGas: number
  gasPrice: string
  refundReceiver: string
  nonce: number
  executionDate: string | null
  submissionDate: string
  modified: string
  blockNumber: number | null
  transactionHash: string | null
  safeTxHash: string
  executor: string | null
  isExecuted: boolean
  isSuccessful: boolean | null
  ethGasPrice: string | null
  gasUsed: number | null
  fee: string | null
  origin: string | null
  dataDecoded: DataDecoded | null
  confirmationsRequired: number | null
  confirmations: Confirmation[]
  signatures: string | null
  transfers: Transfer[]
  txType: TxType.MULTISIG_TRANSACTION
}

export interface ModuleTransaction {
  created: string
  executionDate: string
  blockNumber: number
  transactionHash: string
  safe: string
  module: string
  to: string
  value: string
  data: string
  operation: Operation
  transfers: Transfer[]
  txType: TxType.MODULE_TRANSACTION
}

export interface EthereumTransaction {
  executionDate: string
  to: string
  data: string | null
  txHash: string
  blockNumber: number
  transfers: Transfer[]
  txType: TxType.ETHEREUM_TRANSACTION
  from: string
}

export type Transaction = MultiSigTransaction | ModuleTransaction | EthereumTransaction

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
}

export const METHOD_TO_ID = {
  '0xe318b52b': SAFE_METHODS_NAMES.SWAP_OWNER,
  '0x0d582f13': SAFE_METHODS_NAMES.ADD_OWNER_WITH_THRESHOLD,
  '0xf8dc5dd9': SAFE_METHODS_NAMES.REMOVE_OWNER,
  '0x694e80c3': SAFE_METHODS_NAMES.CHANGE_THRESHOLD,
  '0x610b5925': SAFE_METHODS_NAMES.ENABLE_MODULE,
  '0xe009cfde': SAFE_METHODS_NAMES.DISABLE_MODULE,
}

export type SafeMethods = typeof SAFE_METHODS_NAMES[keyof typeof SAFE_METHODS_NAMES]

type TokenMethods = 'transfer' | 'transferFrom' | 'safeTransferFrom'

type SafeDecodedParams = {
  [key in SafeMethods]?: Record<string, string>
}

type TokenDecodedParams = {
  [key in TokenMethods]?: Record<string, string>
}

export type DecodedParams = SafeDecodedParams | TokenDecodedParams | null
