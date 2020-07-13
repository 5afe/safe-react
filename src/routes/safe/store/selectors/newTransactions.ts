import { NewTransactionsState, TRANSACTIONS } from '../reducer/newTransactions'
import { createSelector } from 'reselect'

export const getNewTransactionsStateSelector = (state: NewTransactionsState): NewTransactionsState =>
  state[TRANSACTIONS]

export const newTransactionsSelector = createSelector(getNewTransactionsStateSelector, (transactionsState) => {
  return transactionsState.transactions
})

export const currentPageSelector = createSelector(getNewTransactionsStateSelector, ({ offset, limit }) => {
  return {
    offset,
    limit,
  }
})
