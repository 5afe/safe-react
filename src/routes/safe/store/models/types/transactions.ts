export enum TxConstants {
  MULTI_SEND = 'multiSend',
  UNKNOWN = 'UNKNOWN',
}

export enum Operation {
  CALL = 'CALL',
  DELEGATE_CALL = 'DELEGATE_CALL',
  CREATE = 'CREATE',
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

export interface DecodedValue {
  operation: Operation
  to: string
  value: number
  data: string
  decodedData: DataDecoded
}

export interface SingleTransactionMethodParameter {
  name: string
  type: string
  value: string
}

export interface MultiSendMethodParameter extends SingleTransactionMethodParameter {
  decodedValue: DecodedValue[]
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
  txType: TxType
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
  txType: TxType
}

export interface EthereumTransaction {
  executionDate: string
  to: string
  data: string | null
  txHash: string
  blockNumber: number
  transfers: Transfer[]
  txType: TxType
  from: string
}

export type Transaction = MultiSigTransaction | ModuleTransaction | EthereumTransaction
