// @flow
import { List, Map } from 'immutable'
import { handleActions, type ActionType } from 'redux-actions'
import addToken, { ADD_TOKEN } from '~/logic/tokens/store/actions/addToken'
import removeToken, { REMOVE_TOKEN } from '~/logic/tokens/store/actions/removeToken'
import addTokens, { ADD_TOKENS } from '~/logic/tokens/store/actions/addTokens'
import { type Token } from '~/logic/tokens/store/model/token'
import disableToken, { DISABLE_TOKEN } from '~/logic/tokens/store/actions/disableToken'
import enableToken, { ENABLE_TOKEN } from '~/logic/tokens/store/actions/enableToken'
import {
  setActiveTokenAddresses,
  getActiveTokenAddresses,
  setToken,
  removeTokenFromStorage,
} from '~/utils/localStorage/tokens'
import { ensureOnce } from '~/utils/singleton'
import { calculateActiveErc20TokensFrom } from '~/utils/tokens'

export const TOKEN_REDUCER_ID = 'tokens'

export type State = Map<string, Map<string, Token>>

const setTokensOnce = ensureOnce(setActiveTokenAddresses)

const removeFromActiveTokens = (safeAddress: string, tokenAddress: string) => {
  const activeTokens = getActiveTokenAddresses(safeAddress)
  const index = activeTokens.indexOf(tokenAddress)
  setActiveTokenAddresses(safeAddress, activeTokens.delete(index))
}

export default handleActions(
  {
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

      const tokenAddress = token.get('address')
      const activeTokens = getActiveTokenAddresses(safeAddress)
      setActiveTokenAddresses(safeAddress, activeTokens.push(tokenAddress))
      setToken(safeAddress, token)
      return state.setIn([safeAddress, tokenAddress], token)
    },
    [REMOVE_TOKEN]: (state: State, action: ActionType<typeof removeToken>): State => {
      const { safeAddress, token } = action.payload

      const tokenAddress = token.get('address')
      removeFromActiveTokens(safeAddress, tokenAddress)
      removeTokenFromStorage(safeAddress, token)
      return state.removeIn([safeAddress, tokenAddress])
    },
    [DISABLE_TOKEN]: (state: State, action: ActionType<typeof disableToken>): State => {
      const { address, safeAddress } = action.payload

      removeFromActiveTokens(safeAddress, address)

      return state.setIn([safeAddress, address, 'status'], false)
    },
    [ENABLE_TOKEN]: (state: State, action: ActionType<typeof enableToken>): State => {
      const { address, safeAddress } = action.payload

      const activeTokens = getActiveTokenAddresses(safeAddress)
      setActiveTokenAddresses(safeAddress, activeTokens.push(address))

      return state.setIn([safeAddress, address, 'status'], true)
    },
  },
  Map(),
)
