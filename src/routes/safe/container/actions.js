// @flow
import fetchSafe from '~/routes/safe/store/actions/fetchSafe'
import fetchTokenBalances from '~/routes/safe/store/actions/fetchTokenBalances'
import createTransaction from '~/routes/safe/store/actions/createTransaction'
import processTransaction from '~/routes/safe/store/actions/processTransaction'
import fetchTransactions from '~/routes/safe/store/actions/fetchTransactions'
import updateSafe from '~/routes/safe/store/actions/updateSafe'
import fetchTokens from '~/logic/tokens/store/actions/fetchTokens'

export type Actions = {
  fetchSafe: typeof fetchSafe,
  fetchTokenBalances: typeof fetchTokenBalances,
  createTransaction: typeof createTransaction,
  fetchTransactions: typeof fetchTransactions,
  updateSafe: typeof updateSafe,
  fetchTokens: typeof fetchTokens,
  processTransaction: typeof processTransaction,
}

export default {
  fetchSafe,
  fetchTokenBalances,
  createTransaction,
  processTransaction,
  fetchTokens,
  fetchTransactions,
  updateSafe,
}
