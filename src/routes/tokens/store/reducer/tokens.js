// @flow
import { List, Map } from 'immutable'
import { handleActions, type ActionType } from 'redux-actions'
import addToken, { ADD_TOKEN } from '~/routes/tokens/store/actions/addToken'
import addTokens, { ADD_TOKENS } from '~/routes/tokens/store/actions/addTokens'
import { type Token } from '~/routes/tokens/store/model/token'
import disableToken, { DISABLE_TOKEN } from '~/routes/tokens/store/actions/disableToken'
import enableToken, { ENABLE_TOKEN } from '~/routes/tokens/store/actions/enableToken'
import { setActiveTokenAddresses, getActiveTokenAddresses } from '~/utils/localStorage/tokens'
import { ensureOnce } from '~/utils/singleton'
import { calculateActiveErc20TokensFrom } from '~/utils/tokens'

export const TOKEN_REDUCER_ID = 'tokens'

export type State = Map<string, Map<string, Token>>

const setTokensOnce = ensureOnce(setActiveTokenAddresses)

export default handleActions({
  [ADD_TOKENS]: (state: State, action: ActionType<typeof addTokens>): State => {
    const { safeAddress, tokens } = action.payload

    const activeAddresses: List<Token> = calculateActiveErc20TokensFrom(tokens.toList())
    setTokensOnce(safeAddress, activeAddresses)

    return state.update(safeAddress, (prevSafe: Map<string, Token>) => {
      if (!prevSafe) {
        return tokens
      }

      return prevSafe.equals(tokens) ? prevSafe : tokens
    })
  },
  [ADD_TOKEN]: (state: State, action: ActionType<typeof addToken>): State => {
    const { safeAddress, token } = action.payload
    const activeTokens = getActiveTokenAddresses(safeAddress)
    activeTokens.push(token.get('address'))
    setActiveTokenAddresses(activeTokens)

    return state.setIn([safeAddress, token.get('address')], token)
  },
  [DISABLE_TOKEN]: (state: State, action: ActionType<typeof disableToken>): State => {
    const { address, safeAddress } = action.payload

    const activeTokens = getActiveTokenAddresses(safeAddress)
    const index = activeTokens.indexOf(address)
    setActiveTokenAddresses(safeAddress, activeTokens.delete(index))

    return state.setIn([safeAddress, address, 'status'], false)
  },
  [ENABLE_TOKEN]: (state: State, action: ActionType<typeof enableToken>): State => {
    const { address, safeAddress } = action.payload

    const activeTokens = getActiveTokenAddresses(safeAddress)
    setActiveTokenAddresses(safeAddress, activeTokens.push(address))

    return state.setIn([safeAddress, address, 'status'], true)
  },
}, Map())
