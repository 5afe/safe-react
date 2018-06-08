// @flow
import fetchTransactions from '~/routes/safe/store/actions/fetchTransactions'

type FetchTransactions = typeof fetchTransactions

export type Actions = {
  fetchTransactions: FetchTransactions,
}

export default {
  fetchTransactions,
}
