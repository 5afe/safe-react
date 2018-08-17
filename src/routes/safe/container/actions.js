// @flow
import fetchSafe from '~/routes/safe/store/actions/fetchSafe'
import fetchTransactions from '~/routes/safe/store/actions/fetchTransactions'
import { fetchTokens } from '~/routes/tokens/store/actions/fetchTokens'

export type Actions = {
  fetchSafe: typeof fetchSafe,
  fetchTokens: typeof fetchTokens,
  fetchTransactions: typeof fetchTransactions,
}

export default {
  fetchSafe,
  fetchTokens,
  fetchTransactions,
}
