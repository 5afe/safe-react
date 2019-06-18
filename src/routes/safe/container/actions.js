// @flow
import fetchSafe from '~/routes/safe/store/actions/fetchSafe'
import fetchTokenBalances from '~/routes/safe/store/actions/fetchTokenBalances'
import createTransaction from '~/routes/safe/store/actions/createTransaction'
import fetchTransactions from '~/routes/safe/store/actions/fetchTransactions'

export type Actions = {
  fetchSafe: typeof fetchSafe,
  fetchTokenBalances: typeof fetchTokenBalances,
  createTransaction: typeof createTransaction,
  fetchTransactions: typeof fetchTransactions,
}

export default {
  fetchSafe,
  fetchTokenBalances,
  createTransaction,
  fetchTransactions,
}
