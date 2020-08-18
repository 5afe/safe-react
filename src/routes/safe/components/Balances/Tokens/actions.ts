import { addToken } from 'src/logic/tokens/store/actions/addToken'
import fetchTokens from 'src/logic/tokens/store/actions/fetchTokens'
import activateTokenForAllSafes from 'src/logic/safe/store/actions/activateTokenForAllSafes'
import updateActiveTokens from 'src/logic/safe/store/actions/updateActiveTokens'
import updateBlacklistedTokens from 'src/logic/safe/store/actions/updateBlacklistedTokens'

export default {
  fetchTokens,
  addToken,
  updateActiveTokens,
  updateBlacklistedTokens,
  activateTokenForAllSafes,
}
