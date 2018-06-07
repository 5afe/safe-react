// @flow
import fetchThreshold from '~/routes/safe/store/actions/fetchThreshold'
import fetchTransactions from '~/routes/safe/store/actions/fetchTransactions'

type FetchThreshold = typeof fetchThreshold
type FetchTransactions = typeof fetchTransactions

export type Actions = {
  fetchThreshold: FetchThreshold,
  fetchTransactions: FetchTransactions,
}

export default {
  fetchThreshold,
  fetchTransactions,
}
