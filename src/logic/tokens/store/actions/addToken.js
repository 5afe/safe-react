// @flow
import { createAction } from 'redux-actions'
import { type Token } from '~/logic/tokens/store/model/token'
import { setActiveTokens, getActiveTokenAddresses, setToken } from '~/logic/tokens/utils/tokensStorage'
import type { Dispatch as ReduxDispatch } from 'redux'
import { type GlobalState } from '~/store/index'

export const ADD_TOKEN = 'ADD_TOKEN'

type AddTokenProps = {
  safeAddress: string,
  token: Token,
}

export const addToken = createAction(
  ADD_TOKEN,
  (safeAddress: string, token: Token): AddTokenProps => ({
    safeAddress,
    token,
  }),
)

const saveToken = (safeAddress: string, token: Token) => async (dispatch: ReduxDispatch<GlobalState>) => {
  dispatch(addToken(safeAddress, token))

  const tokenAddress = token.get('address')
  const activeTokens = await getActiveTokenAddresses(safeAddress)
  await setActiveTokens(safeAddress, activeTokens.push(tokenAddress))
  setToken(safeAddress, token)
}

export default saveToken
