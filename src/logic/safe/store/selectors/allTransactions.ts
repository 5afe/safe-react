import { TransactionsState, TRANSACTIONS } from '../reducer/allTransactions'
import { createSelector } from 'reselect'
import { safeParamAddressFromStateSelector } from './index'
import { AppReduxState } from '../../../../store'

export const getTransactionsStateSelector = (state: AppReduxState): TransactionsState => state[TRANSACTIONS]

export const allTransactionsSelector = createSelector(getTransactionsStateSelector, (transactionsState) => {
  return transactionsState
})

export const safeAllTransactionsSelector = createSelector(
  safeParamAddressFromStateSelector,
  allTransactionsSelector,
  (safeAddress, transactions) => transactions[safeAddress],
)
