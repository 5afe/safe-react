// @flow
import fetchTokens from '~/logic/tokens/store/actions/fetchTokens'
import updateActiveTokens from '~/routes/safe/store/actions/updateActiveTokens'

export type Actions = {
  fetchTokens: Function,
  updateActiveTokens: Function
}

export default {
  fetchTokens,
  updateActiveTokens,
}
