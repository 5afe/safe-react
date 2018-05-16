// @flow
import fetchDailyLimit from '~/routes/safe/store/actions/fetchDailyLimit'

export type Actions = {
  fetchDailyLimit: typeof fetchDailyLimit,
}

export default {
  fetchDailyLimit,
}
