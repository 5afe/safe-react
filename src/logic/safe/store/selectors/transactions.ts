import { List } from 'immutable'
import { createSelector } from 'reselect'

import { safeIncomingTransactionsSelector, safeTransactionsSelector } from 'src/logic/safe/store/selectors'
import { Transaction, SafeModuleTransaction } from 'src/logic/safe/store/models/types/transaction'
import { safeModuleTransactionsSelector } from 'src/routes/safe/container/selector'

export const extendedTransactionsSelector = createSelector(
  safeTransactionsSelector,
  safeIncomingTransactionsSelector,
  safeModuleTransactionsSelector,
  (transactions, incomingTransactions, moduleTransactions): List<Transaction | SafeModuleTransaction> =>
    List([...transactions, ...incomingTransactions, ...moduleTransactions]),
)
