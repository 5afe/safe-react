import { List } from 'immutable'
import { createSelector } from 'reselect'

import { safeIncomingTransactionsSelector, safeTransactionsSelector } from 'src/logic/safe/store/selectors/index'

export const extendedTransactionsSelector = createSelector(
  safeTransactionsSelector,
  safeIncomingTransactionsSelector,
  (transactions, incomingTransactions) => List([...transactions, ...incomingTransactions]),
)
