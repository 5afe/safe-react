// @flow
import fetchTokens from '~/logic/tokens/store/actions/fetchTokens'
import { addToken } from '~/logic/tokens/store/actions/addToken'
import updateActiveTokens from '~/routes/safe/store/actions/updateActiveTokens'

export type Actions = {
  fetchTokens: Function,
  updateActiveTokens: Function,
  addToken: Function,
}

export default {
  fetchTokens,
  addToken,
  updateActiveTokens,
}
