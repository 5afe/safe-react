// @flow
import { createAction } from 'redux-actions'
import { type Token } from '~/logic/tokens/store/model/token'
import type { Dispatch as ReduxDispatch } from 'redux'
import { type GlobalState } from '~/store/index'
import { removeFromActiveTokens } from '~/logic/tokens/utils/tokensStorage'

export const DISABLE_TOKEN = 'DISABLE_TOKEN'

export const disableToken = createAction<string, *, *>(DISABLE_TOKEN, (safeAddress: string, token: Token) => ({
  safeAddress,
  token,
}))

const hideToken = (safeAddress: string, token: Token) => async (dispatch: ReduxDispatch<GlobalState>) => {
  dispatch(disableToken(safeAddress, token))

  await removeFromActiveTokens(safeAddress, token)
}

export default hideToken
