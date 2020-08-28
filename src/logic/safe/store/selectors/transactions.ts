import { List } from 'immutable'
import { createSelector } from 'reselect'

import {
  safeIncomingTransactionsSelector,
  safeTransactionsSelector,
  safeModuleTransactionsSelector,
} from 'src/logic/safe/store/selectors'
import { Transaction, SafeModuleTransaction } from 'src/logic/safe/store/models/types/transaction'

export const extendedTransactionsSelector = createSelector(
  safeTransactionsSelector,
  safeIncomingTransactionsSelector,
  safeModuleTransactionsSelector,
  (transactions, incomingTransactions, moduleTransactions): List<Transaction | SafeModuleTransaction> =>
    List([...transactions, ...incomingTransactions, ...moduleTransactions]),
)
