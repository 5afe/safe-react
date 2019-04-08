// @flow
import fetchSafe from '~/routes/safe/store/actions/fetchSafe'
import { fetchTokens } from '~/logic/tokens/store/actions/fetchTokens'
import loadActiveTokens from '~/logic/tokens/store/actions/loadActiveTokens'

export type Actions = {
  fetchSafe: typeof fetchSafe,
  fetchTokens: typeof fetchTokens,
  loadActiveTokens: typeof loadActiveTokens,
}

export default {
  fetchSafe,
  fetchTokens,
  loadActiveTokens,
}
