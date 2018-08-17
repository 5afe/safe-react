// @flow
import fetchSafe from '~/routes/safe/store/actions/fetchSafe'
import { fetchTokens } from '~/routes/tokens/store/actions/fetchTokens'

export type Actions = {
  fetchSafe: typeof fetchSafe,
  fetchTokens: typeof fetchTokens,
}

export default {
  fetchSafe,
  fetchTokens,
}
