import { addToken } from 'src/logic/tokens/store/actions/addToken'
import fetchTokens from 'src/logic/tokens/store/actions/fetchTokens'
import activateTokenForAllSafes from 'src/routes/safe/store/actions/activateTokenForAllSafes'
import updateActiveTokens from 'src/routes/safe/store/actions/updateActiveTokens'
import updateBlacklistedTokens from 'src/routes/safe/store/actions/updateBlacklistedTokens'

export default {
  fetchTokens,
  addToken,
  updateActiveTokens,
  updateBlacklistedTokens,
  activateTokenForAllSafes,
}
