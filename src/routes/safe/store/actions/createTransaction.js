// @flow
import type { Dispatch as ReduxDispatch, GetState } from 'redux'
import { createAction } from 'redux-actions'
import { EMPTY_DATA } from '~/logic/wallets/ethTransactions'
import { userAccountSelector } from '~/logic/wallets/store/selectors'
import { type GlobalState } from '~/store'
import { getGnosisSafeInstanceAt } from '~/logic/contracts/safeContracts'
import { executeTransaction, CALL } from '~/logic/safe/transactions'

const createTransaction = (
  safeAddress: string,
  to: string,
  valueInWei: string,
  txData: string = EMPTY_DATA,
  openSnackbar: Function,
) => async (dispatch: ReduxDispatch<GlobalState>, getState: GetState<GlobalState>) => {
  const state: GlobalState = getState()

  const safeInstance = await getGnosisSafeInstanceAt(safeAddress)
  const from = userAccountSelector(state)
  const threshold = await safeInstance.getThreshold()
  const nonce = (await safeInstance.nonce()).toString()
  const isExecution = threshold.toNumber() === 1

  let txHash
  if (isExecution) {
    openSnackbar('Transaction has been submitted', 'success')
    txHash = await executeTransaction(safeInstance, to, valueInWei, txData, CALL, nonce, from)
    openSnackbar('Transaction has been confirmed', 'success')
  } else {
    // txHash = await approveTransaction(safeAddress, to, valueInWei, txData, CALL, nonce)
  }
  // dispatch(addTransactions(txHash))

  return txHash
}

export default createTransaction
