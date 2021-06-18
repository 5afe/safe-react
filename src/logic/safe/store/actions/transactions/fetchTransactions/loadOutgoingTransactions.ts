import { DataDecoded } from 'src/logic/safe/store/models/types/transactions.d'

export type ConfirmationServiceModel = {
  confirmationType: string
  owner: string
  submissionDate: string
  signature: string
  signatureType: string
  transactionHash: string
}

export type TxServiceModel = {
  baseGas: number
  blockNumber?: number | null
  confirmations: ConfirmationServiceModel[]
  confirmationsRequired: number
  data: string | null
  dataDecoded?: DataDecoded
  ethGasPrice: string
  executionDate?: string | null
  executor: string
  fee: string
  gasPrice: string
  gasToken: string
  gasUsed: number
  isExecuted: boolean
  isSuccessful: boolean
  modified: string
  nonce: number
  operation: number
  origin: string | null
  refundReceiver: string
  safe: string
  safeTxGas: number
  safeTxHash: string
  signatures: string
  submissionDate: string | null
  to: string
  transactionHash?: string | null
  value: string
}
