// @flow
import { Map, List } from 'immutable'
import { createAction } from 'redux-actions'
import type { Dispatch as ReduxDispatch } from 'redux'
import { type Token } from '~/logic/tokens/store/model/token'
import { ensureOnce } from '~/utils/singleton'
import { type GlobalState } from '~/store/index'
import { setActiveTokenAddresses } from '~/logic/tokens/utils/activeTokensStorage'
import { calculateActiveErc20TokensFrom } from '~/logic/tokens/utils/tokenHelpers'

export const ADD_TOKENS = 'ADD_TOKENS'

const setTokensOnce = ensureOnce(setActiveTokenAddresses)

type TokenProps = {
  safeAddress: string,
  tokens: Map<string, Token>,
}

const addTokens = createAction(
  ADD_TOKENS,
  (safeAddress: string, tokens: Map<string, Token>): TokenProps => ({
    safeAddress,
    tokens,
  }),
)

const saveTokens = (safeAddress: string, tokens: Map<string, Token>) => (dispatch: ReduxDispatch<GlobalState>) => {
  dispatch(addTokens(safeAddress, tokens))

  const activeAddresses: List<Token> = calculateActiveErc20TokensFrom(tokens.toList())
  setTokensOnce(safeAddress, activeAddresses)
}

export default saveTokens
