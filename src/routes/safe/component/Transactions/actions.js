// @flow
import fetchTransactions from '~/routes/safe/store/actions/fetchTransactions'

export type Actions = {
  fetchTransactions: typeof fetchTransactions,
}

export default {
  fetchTransactions,
}
