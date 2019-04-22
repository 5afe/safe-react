// @flow
import { createAction } from 'redux-actions'
import { type Token } from '~/logic/tokens/store/model/token'
import { saveActiveTokens, getActiveTokens, setToken } from '~/logic/tokens/utils/tokensStorage'
import type { Dispatch as ReduxDispatch } from 'redux'
import { type GlobalState } from '~/store/'

export const ADD_TOKEN = 'ADD_TOKEN'

type AddTokenProps = {
  safeAddress: string,
  token: Token,
}

export const addToken = createAction<string, *, *>(
  ADD_TOKEN,
  (token: Token): AddTokenProps => ({
    token,
  }),
)

const saveToken = (safeAddress: string, token: Token) => async (dispatch: ReduxDispatch<GlobalState>) => {
  dispatch(addToken(token))

  const activeTokens = await getActiveTokens(safeAddress)
  await saveActiveTokens(safeAddress, activeTokens.push(token.toJS()))
  setToken(safeAddress, token)
}

export default saveToken
