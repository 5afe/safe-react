import { NewTransactionsState, TRANSACTIONS } from '../reducer/newTransactions'
import { createSelector } from 'reselect'
import { safeParamAddressFromStateSelector } from './index'

export const getNewTransactionsStateSelector = (state: NewTransactionsState): NewTransactionsState =>
  state[TRANSACTIONS]

export const newTransactionsSelector = createSelector(getNewTransactionsStateSelector, (transactionsState) => {
  return transactionsState.transactions
})

export const safeNewTransactionsSelector = createSelector(
  safeParamAddressFromStateSelector,
  newTransactionsSelector,
  (safeAddress, transactions) => transactions[safeAddress],
)

export const currentPageSelector = createSelector(
  getNewTransactionsStateSelector,
  ({ offset, limit, transactionsCount }) => {
    return {
      offset,
      limit,
      currentPage: Math.floor(offset / limit) + 1,
      maxPages: Math.ceil(transactionsCount / limit),
    }
  },
)

export const newTransactionsCurrentPageSelector = createSelector(
  safeNewTransactionsSelector,
  currentPageSelector,
  (transactions, page) => {
    if (!transactions) return []
    return transactions.slice(page.offset, page.offset * 2 || page.limit)
  },
)
