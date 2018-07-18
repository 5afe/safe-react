// @flow
import { List, Map } from 'immutable'
import { handleActions, type ActionType } from 'redux-actions'
import addToken, { ADD_TOKEN } from '~/routes/tokens/store/actions/addToken'
import addTokens, { ADD_TOKENS } from '~/routes/tokens/store/actions/addTokens'
import { type Token } from '~/routes/tokens/store/model/token'
import disableToken, { DISABLE_TOKEN } from '~/routes/tokens/store/actions/disableToken'
import enableToken, { ENABLE_TOKEN } from '~/routes/tokens/store/actions/enableToken'
import { setTokens, getTokens } from '~/utils/localStorage/tokens'
import { ensureOnce } from '~/utils/singleton'
import { calculateActiveErc20TokensFrom } from '~/utils/tokens'

export const TOKEN_REDUCER_ID = 'tokens'

export type State = Map<string, Map<string, Token>>

const setTokensOnce = ensureOnce(setTokens)

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
    const activeTokens = getTokens(safeAddress)
    activeTokens.push(token.get('address'))
    setTokens(activeTokens)

    return state.setIn([safeAddress, token.get('address')], token)
  },
  [DISABLE_TOKEN]: (state: State, action: ActionType<typeof disableToken>): State => {
    const { address, safeAddress, symbol } = action.payload

    const activeTokens = getTokens(safeAddress)
    const index = activeTokens.indexOf(address)
    setTokens(safeAddress, activeTokens.delete(index))

    return state.setIn([safeAddress, symbol, 'status'], false)
  },
  [ENABLE_TOKEN]: (state: State, action: ActionType<typeof enableToken>): State => {
    const { address, safeAddress, symbol } = action.payload

    const activeTokens = getTokens(safeAddress)
    setTokens(safeAddress, activeTokens.push(address))

    return state.setIn([safeAddress, symbol, 'status'], true)
  },
}, Map())
