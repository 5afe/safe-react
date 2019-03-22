// @flow
import { createAction } from 'redux-actions'
import { type Token } from '~/logic/tokens/store/model/token'
import {
  setActiveTokenAddresses,
  getActiveTokenAddresses,
  setToken,
} from '~/logic/tokens/utils/activeTokensStorage'
import type { Dispatch as ReduxDispatch } from 'redux'
import { type GlobalState } from '~/store/index'

export const ADD_TOKEN = 'ADD_TOKEN'

type AddTokenProps = {
  safeAddress: string,
  token: Token,
}

const addToken = createAction(
  ADD_TOKEN,
  (safeAddress: string, token: Token): AddTokenProps => ({
    safeAddress,
    token,
  }),
)

const saveToken = (safeAddress: string, token: Token) => (dispatch: ReduxDispatch<GlobalState>) => {
  dispatch(addToken(safeAddress, token))

  const tokenAddress = token.get('address')
  const activeTokens = getActiveTokenAddresses(safeAddress)
  setActiveTokenAddresses(safeAddress, activeTokens.push(tokenAddress))
  setToken(safeAddress, token)
}


export default saveToken
