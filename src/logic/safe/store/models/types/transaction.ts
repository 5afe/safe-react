import { GnosisSafe } from 'src/types/contracts/GnosisSafe.d'
import { Operation } from 'src/types/gateway/transactions'

export enum PendingActionType {
  CONFIRM = 'confirm',
  REJECT = 'reject',
}
export type PendingActionValues = PendingActionType[keyof PendingActionType]

export type TxArgs = {
  baseGas: number
  data: string
  gasPrice: string
  gasToken: string
  nonce: number
  operation: Operation
  refundReceiver: string
  safeInstance: GnosisSafe
  safeTxGas: number
  sender?: string
  sigs: string
  to: string
  valueInWei: string
}
