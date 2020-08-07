import { List } from 'immutable'
import { createSelector } from 'reselect'

import { safeIncomingTransactionsSelector, safeTransactionsSelector } from 'src/routes/safe/store/selectors'
import { Transaction } from 'src/routes/safe/store/models/types/transaction'

export const extendedTransactionsSelector = createSelector(
  safeTransactionsSelector,
  safeIncomingTransactionsSelector,
  (transactions, incomingTransactions): List<Transaction> => List([...transactions, ...incomingTransactions]),
)
