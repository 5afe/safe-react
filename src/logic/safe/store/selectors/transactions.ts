import { List } from 'immutable'
import { createSelector } from 'reselect'

import { safeIncomingTransactionsSelector, safeTransactionsSelector } from 'src/logic/safe/store/selectors'
import { Transaction } from 'src/logic/safe/store/models/types/transaction'

export const extendedTransactionsSelector = createSelector(
  safeTransactionsSelector,
  safeIncomingTransactionsSelector,
  (transactions, incomingTransactions): List<Transaction> => List([...transactions, ...incomingTransactions]),
)
