// @flow
import fetchSafe from '~/routes/safe/store/actions/fetchSafe'
import { fetchBalances } from '~/routes/safe/store/actions/fetchBalances'

export type Actions = {
  fetchSafe: typeof fetchSafe,
  fetchBalances: typeof fetchBalances,
}

export default {
  fetchSafe,
  fetchBalances,
}
