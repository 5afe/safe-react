// @flow
import type { Dispatch as ReduxDispatch } from 'redux'
import { createAction } from 'redux-actions'

import { type Token } from '~/logic/tokens/store/model/token'
import { removeFromActiveTokens, removeTokenFromStorage } from '~/logic/tokens/utils/tokensStorage'
import { type GlobalState } from '~/store/index'

export const REMOVE_TOKEN = 'REMOVE_TOKEN'

type RemoveTokenProps = {
  safeAddress: string,
  token: Token,
}

export const removeToken = createAction<string, *, *>(
  REMOVE_TOKEN,
  (safeAddress: string, token: Token): RemoveTokenProps => ({
    safeAddress,
    token,
  }),
)

const deleteToken = (safeAddress: string, token: Token) => async (dispatch: ReduxDispatch<GlobalState>) => {
  dispatch(removeToken(safeAddress, token))

  await removeFromActiveTokens(safeAddress, token)
  await removeTokenFromStorage(safeAddress, token)
}

export default deleteToken
