// @flow
import fetchTokens from '~/logic/tokens/store/actions/fetchTokens'
import { addToken } from '~/logic/tokens/store/actions/addToken'
import updateActiveTokens from '~/routes/safe/store/actions/updateActiveTokens'
import updateBlacklistedTokens from '~/routes/safe/store/actions/updateBlacklistedTokens'
import activateTokenForAllSafes from '~/routes/safe/store/actions/activateTokenForAllSafes'

export type Actions = {
  fetchTokens: Function,
  updateActiveTokens: Function,
  updateBlacklistedTokens: Function,
  addToken: Function,
  activateTokenForAllSafes: Function,
}

export default {
  fetchTokens,
  addToken,
  updateActiveTokens,
  updateBlacklistedTokens,
  activateTokenForAllSafes,
}
