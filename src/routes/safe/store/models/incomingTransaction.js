// @flow
import { Record } from 'immutable'
import type { RecordFactory, RecordOf } from 'immutable'

export type IncomingTransactionProps = {
  blockNumber: number,
  executionTxHash: string,
  to: string,
  value: number,
  tokenAddress: string,
  from: string,
  symbol: string,
  decimals: number,
  executionDate: string,
}

export const makeIncomingTransaction: RecordFactory<IncomingTransactionProps> = Record({
  blockNumber: 0,
  executionTxHash: '',
  to: '',
  value: 0,
  tokenAddress: '',
  from: '',
  symbol: '',
  decimals: 18,
  executionDate: '',
})

export type IncomingTransaction = RecordOf<IncomingTransactionProps>
