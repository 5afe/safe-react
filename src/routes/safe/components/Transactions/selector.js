// @flow
import { List } from 'immutable'
import { createStructuredSelector } from 'reselect'
import { type Transaction } from '~/routes/safe/store/models/transaction'
import { safeTransactionsSelector } from '~/routes/safe/store/selectors/index'
import { userAccountSelector } from '~/logic/wallets/store/selectors'

export type SelectorProps = {
  transactions: List<Transaction>,
  userAddress: typeof userAccountSelector,
}

export default createStructuredSelector<Object, *>({
  transactions: safeTransactionsSelector,
  userAddress: userAccountSelector,
})
