import { List } from 'immutable'
import { createSelector } from 'reselect'

import { safeIncomingTransactionsSelector, safeTransactionsSelector } from 'src/routes/safe/store/selectors'

export const extendedTransactionsSelector = createSelector(
  safeTransactionsSelector,
  safeIncomingTransactionsSelector,
  (transactions, incomingTransactions) => List([...transactions, ...incomingTransactions]),
)
