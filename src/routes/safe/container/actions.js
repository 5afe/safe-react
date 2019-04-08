// @flow
import fetchSafe from '~/routes/safe/store/actions/fetchSafe'
import { fetchTokens } from '~/logic/tokens/store/actions/fetchTokens'
import loadActiveTokens from '~/logic/tokens/store/actions/loadActiveTokens'
import fetchTokenBalances from '~/logic/tokens/store/actions/fetchTokenBalances'

export type Actions = {
  fetchSafe: typeof fetchSafe,
  fetchTokens: typeof fetchTokens,
  loadActiveTokens: typeof loadActiveTokens,
  fetchTokenBalances: typeof fetchTokenBalances
}

export default {
  fetchSafe,
  fetchTokens,
  loadActiveTokens,
  fetchTokenBalances,
}
