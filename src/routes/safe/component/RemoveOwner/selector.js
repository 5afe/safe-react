// @flow
import { List } from 'immutable'
import { createStructuredSelector, createSelector } from 'reselect'
import { userAccountSelector } from '~/logic/wallets/store/selectors'
import { type Transaction } from '~/routes/safe/store/models/transaction'
import { safeTransactionsSelector } from '~/routes/safe/store/selectors/index'

const pendingTransactionsSelector = createSelector(
  safeTransactionsSelector,
  (transactions: List<Transaction>) => transactions.findEntry((tx: Transaction) => tx.get('isExecuted')),
)

export type SelectorProps = {
  executor: userAccountSelector,
  pendingTransactions: pendingTransactionsSelector,
}

export default createStructuredSelector({
  executor: userAccountSelector,
  pendingTransactions: pendingTransactionsSelector,
})
