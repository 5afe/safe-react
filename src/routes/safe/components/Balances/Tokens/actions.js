// 
import { addToken } from 'logic/tokens/store/actions/addToken'
import fetchTokens from 'logic/tokens/store/actions/fetchTokens'
import activateTokenForAllSafes from 'routes/safe/store/actions/activateTokenForAllSafes'
import updateActiveTokens from 'routes/safe/store/actions/updateActiveTokens'
import updateBlacklistedTokens from 'routes/safe/store/actions/updateBlacklistedTokens'


export default {
  fetchTokens,
  addToken,
  updateActiveTokens,
  updateBlacklistedTokens,
  activateTokenForAllSafes,
}
