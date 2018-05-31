// @flow
import { List } from 'immutable'
import { createStructuredSelector } from 'reselect'
import { type Transaction } from '~/routes/safe/store/model/transaction'
import { safeTransactionsSelector } from '~/routes/safe/store/selectors/index'

export type SelectorProps = {
  transactions: List<Transaction>,
}

export default createStructuredSelector({
  transactions: safeTransactionsSelector,
})
