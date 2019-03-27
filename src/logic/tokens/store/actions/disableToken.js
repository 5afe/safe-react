// @flow
import { createAction } from 'redux-actions'
import { type Token } from '~/logic/tokens/store/model/token'
import type { Dispatch as ReduxDispatch } from 'redux'
import { type GlobalState } from '~/store/index'
import { removeFromActiveTokens } from '~/logic/tokens/utils/tokensStorage'

export const DISABLE_TOKEN = 'DISABLE_TOKEN'

export const disableToken = createAction(DISABLE_TOKEN, (safeAddress: string, tokenAddress: string) => ({
  safeAddress,
  tokenAddress,
}))

const hideToken = (safeAddress: string, token: Token) => async (dispatch: ReduxDispatch<GlobalState>) => {
  const { address } = token
  dispatch(disableToken(safeAddress, address))

  await removeFromActiveTokens(safeAddress, address)
}

export default hideToken
