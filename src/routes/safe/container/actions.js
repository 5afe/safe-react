// @flow
import fetchSafe from '~/routes/safe/store/actions/fetchSafe'
import fetchBalance from '~/routes/safe/store/actions/fetchBalance'

export type Actions = {
  fetchSafe: typeof fetchSafe,
  fetchBalance: typeof fetchBalance,
}

export default {
  fetchSafe,
  fetchBalance,
}
