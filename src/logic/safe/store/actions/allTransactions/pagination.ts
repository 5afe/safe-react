import { createAction } from 'redux-actions'
import { Transaction } from '../../models/types/transactions'

export const LOAD_MORE_TRANSACTIONS = 'LOAD_MORE_TRANSACTIONS'

export type LoadMoreTransactionsAction = {
  payload: {
    safeAddress: string
    transactions: Transaction[]
    totalTransactionsAmount: number
  }
}

export const loadMore = createAction(LOAD_MORE_TRANSACTIONS)
