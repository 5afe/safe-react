import { TransactionsState, TRANSACTIONS } from '../reducer/allTransactions'
import { createSelector } from 'reselect'
import { safeParamAddressFromStateSelector } from './index'

export const getTransactionsStateSelector = (state: TransactionsState): TransactionsState => state[TRANSACTIONS]

export const allTransactionsSelector = createSelector(getTransactionsStateSelector, (transactionsState) => {
  return transactionsState.transactions
})

export const safeAllTransactionsSelector = createSelector(
  safeParamAddressFromStateSelector,
  allTransactionsSelector,
  (safeAddress, transactions) => transactions[safeAddress],
)
