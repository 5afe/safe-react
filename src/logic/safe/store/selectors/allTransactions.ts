import { TransactionsState, TRANSACTIONS } from '../reducer/allTransactions'
import { createSelector } from 'reselect'
import { safeParamAddressFromStateSelector } from './index'
import { AppReduxState } from 'src/store'

export const getTransactionsStateSelector = (state: AppReduxState): TransactionsState => state[TRANSACTIONS]

export const allTransactionsSelector = createSelector(getTransactionsStateSelector, (transactionsState) => {
  return transactionsState
})

export const safeAllTransactionsSelector = createSelector(
  safeParamAddressFromStateSelector,
  allTransactionsSelector,
  (safeAddress, transactions) => (safeAddress ? transactions[safeAddress]?.transactions : []),
)

export const safeTotalTransactionsAmountSelector = createSelector(
  safeParamAddressFromStateSelector,
  allTransactionsSelector,
  (safeAddress, transactions) => (safeAddress ? transactions[safeAddress]?.totalTransactionsCount : 0),
)
