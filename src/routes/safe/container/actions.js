// @flow
import fetchBalance from '~/routes/safe/store/actions/fetchBalance'

export type Actions = {
  fetchBalance: typeof fetchBalance,
}

export default {
  fetchBalance,
}
