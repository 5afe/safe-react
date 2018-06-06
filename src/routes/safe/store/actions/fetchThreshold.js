// @flow
import type { Dispatch as ReduxDispatch } from 'redux'
import { type GlobalState } from '~/store/index'
import { getSafeEthereumInstance } from '~/routes/safe/component/AddTransaction/createTransactions'
import updateThreshold from './updateThreshold'

export default (safeAddress: string) => async (dispatch: ReduxDispatch<GlobalState>) => {
  const gnosisSafe = await getSafeEthereumInstance(safeAddress)
  const actualThreshold = await gnosisSafe.getThreshold()

  return dispatch(updateThreshold(safeAddress, actualThreshold))
}
