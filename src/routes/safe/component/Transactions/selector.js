// @flow
import { List } from 'immutable'
import { createStructuredSelector } from 'reselect'
import { type Transaction } from '~/routes/safe/store/model/transaction'
import { safeTransactionsSelector } from '~/routes/safe/store/selectors/index'
import { userAccountSelector } from '~/logic/wallets/store/selectors'

export type SelectorProps = {
  transactions: List<Transaction>,
  userAddress: userAccountSelector,
}

export default createStructuredSelector({
  transactions: safeTransactionsSelector,
  userAddress: userAccountSelector,
})
