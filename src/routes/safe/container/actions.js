// @flow
import fetchSafe from '~/routes/safe/store/actions/fetchSafe'
import fetchTokenBalances from '~/routes/safe/store/actions/fetchTokenBalances'
import createTransaction from '~/routes/safe/store/actions/createTransaction'
import fetchTransactions from '~/routes/safe/store/actions/fetchTransactions'
import fetchTokens from '~/logic/tokens/store/actions/fetchTokens'

export type Actions = {
  fetchSafe: typeof fetchSafe,
  fetchTokenBalances: typeof fetchTokenBalances,
  createTransaction: typeof createTransaction,
  fetchTransactions: typeof fetchTransactions,
  fetchTokens: typeof fetchTokens,
}

export default {
  fetchSafe,
  fetchTokenBalances,
  createTransaction,
  fetchTokens,
  fetchTransactions,
}
