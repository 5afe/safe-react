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

export const currentPageSelector = createSelector(
  getTransactionsStateSelector,
  ({ offset, limit, totalTransactionsAmount }) => {
    return {
      offset,
      limit,
      currentPage: Math.floor(offset / limit) + 1,
      maxPages: Math.ceil(totalTransactionsAmount / limit),
    }
  },
)

export const allTransactionsCurrentPageSelector = createSelector(
  safeAllTransactionsSelector,
  currentPageSelector,
  (transactions, page) => {
    if (!transactions) return []
    return transactions.slice(page.offset, page.offset * 2 || page.limit)
  },
)
