// @flow
import { createAction } from 'redux-actions'
import type { Dispatch as ReduxDispatch } from 'redux'
import { type GlobalState } from '~/store/index'
import { type Token } from '~/logic/tokens/store/model/token'
import { setActiveTokenAddresses, getActiveTokenAddresses } from '~/logic/tokens/utils/tokensStorage'

export const ENABLE_TOKEN = 'ENABLE_TOKEN'

const enableToken = createAction(ENABLE_TOKEN, (safeAddress: string, tokenAddress: string) => ({
  safeAddress,
  tokenAddress,
}))

const setTokenEnabled = (safeAddress: string, token: Token) => async (dispatch: ReduxDispatch<GlobalState>) => {
  const { address } = token
  dispatch(enableToken(safeAddress, address))

  const activeTokens = await getActiveTokenAddresses(safeAddress)
  await setActiveTokenAddresses(safeAddress, activeTokens.push(address))
}

export default setTokenEnabled
