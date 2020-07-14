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

export const currentPageSelector = createSelector(getNewTransactionsStateSelector, ({ offset, limit }) => {
  return {
    offset,
    limit,
  }
})

export const newTransactionsCurrentPageSelector = createSelector(
  safeNewTransactionsSelector,
  currentPageSelector,
  (transactions, page) => {
    if (!transactions) return []
    const txsOffset = page.offset
    return transactions.slice(txsOffset, txsOffset * 2)
  },
)
