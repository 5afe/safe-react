// @flow
import fetchBalance from '~/routes/safe/store/actions/fetchBalance'
import fetchDailyLimit from '~/routes/safe/store/actions/fetchDailyLimit'

export type Actions = {
  fetchBalance: typeof fetchBalance,
  fetchDailyLimit: typeof fetchDailyLimit,
}

export default {
  fetchBalance,
  fetchDailyLimit,
}
