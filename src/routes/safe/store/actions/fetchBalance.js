// @flow
import type { Dispatch as ReduxDispatch } from 'redux'
import { getBalanceInEtherOf } from '~/wallets/getWeb3'
import { type GlobalState } from '~/store/index'
import addBalance from './addBalance'

export default (safeAddress: string) => async (dispatch: ReduxDispatch<GlobalState>) => {
  const balance = await getBalanceInEtherOf(safeAddress)

  return dispatch(addBalance(safeAddress, balance))
}
