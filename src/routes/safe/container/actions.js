// @flow
import fetchSafe from '~/routes/safe/store/actions/fetchSafe'
import loadActiveTokens from '~/logic/tokens/store/actions/loadActiveTokens'
import fetchTokenBalances from '~/routes/safe/store/actions/fetchTokenBalances'

export type Actions = {
  fetchSafe: typeof fetchSafe,
  loadActiveTokens: typeof loadActiveTokens,
  fetchTokenBalances: typeof fetchTokenBalances,
}

export default {
  fetchSafe,
  loadActiveTokens,
  fetchTokenBalances,
}
