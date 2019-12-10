// @flow
import { Record } from 'immutable'
import type { RecordFactory, RecordOf } from 'immutable'

export type IncomingTransactionProps = {
  blockNumber: number,
  transactionHash: string,
  to: string,
  value: number,
  tokenAddress: string,
  from: string,
}

export const makeIncomingTransaction: RecordFactory<IncomingTransactionProps> = Record({
  blockNumber: 0,
  transactionHash: '',
  to: '',
  value: 0,
  tokenAddress: '',
  from: '',
})

export type IncomingTransaction = RecordOf<IncomingTransactionProps>
