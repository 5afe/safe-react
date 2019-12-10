// @flow
import { Record } from 'immutable'
import type { RecordFactory, RecordOf } from 'immutable'

export const INCOMING_TX_TYPE = 'incoming'

export type IncomingTransactionProps = {
  blockNumber: number,
  executionTxHash: string,
  safeTxHash: string,
  to: string,
  value: number,
  tokenAddress: string,
  from: string,
  symbol: string,
  decimals: number,
  fee: string,
  executionDate: string,
  type: string,
  status: string,
}

export const makeIncomingTransaction: RecordFactory<IncomingTransactionProps> = Record({
  blockNumber: 0,
  executionTxHash: '',
  safeTxHash: '',
  to: '',
  value: 0,
  tokenAddress: '',
  from: '',
  symbol: '',
  decimals: 18,
  fee: '',
  executionDate: '',
  type: INCOMING_TX_TYPE,
  status: 'success',
})

export type IncomingTransaction = RecordOf<IncomingTransactionProps>
