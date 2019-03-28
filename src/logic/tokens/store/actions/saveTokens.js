// @flow
import { Map, List } from 'immutable'
import { createAction } from 'redux-actions'
import type { Dispatch as ReduxDispatch } from 'redux'
import { type Token } from '~/logic/tokens/store/model/token'
import { ensureOnceAsync } from '~/utils/singleton'
import { type GlobalState } from '~/store/index'
import { setActiveTokens } from '~/logic/tokens/utils/tokensStorage'
import { calculateActiveErc20TokensFrom } from '~/logic/tokens/utils/tokenHelpers'

export const ADD_TOKENS = 'ADD_TOKENS'

const setTokensOnce = ensureOnceAsync(setActiveTokens)

type TokenProps = {
  safeAddress: string,
  tokens: Map<string, Token>,
}

export const addTokens = createAction<string, *, *>(
  ADD_TOKENS,
  (safeAddress: string, tokens: Map<string, Token>): TokenProps => ({
    safeAddress,
    tokens,
  }),
)

const saveTokens = (safeAddress: string, tokens: Map<string, Token>) => async (
  dispatch: ReduxDispatch<GlobalState>,
) => {
  dispatch(addTokens(safeAddress, tokens))

  const activeAddresses: List<Token> = calculateActiveErc20TokensFrom(tokens.toList())
  await setTokensOnce(safeAddress, activeAddresses)
}

export default saveTokens
