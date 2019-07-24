// @flow
import type { Dispatch as ReduxDispatch, GetState } from 'redux'
import { EMPTY_DATA } from '~/logic/wallets/ethTransactions'
import { userAccountSelector } from '~/logic/wallets/store/selectors'
import fetchTransactions from '~/routes/safe/store/actions/fetchTransactions'
import showSnackbarMsg from '~/components/Snackbar/store/actions/showSnackbarMsg'
import { type GlobalState } from '~/store'
import { getGnosisSafeInstanceAt } from '~/logic/contracts/safeContracts'
import { approveTransaction, executeTransaction, CALL } from '~/logic/safe/transactions'

const createTransaction = (
  safeAddress: string,
  to: string,
  valueInWei: string,
  txData: string = EMPTY_DATA,
  shouldExecute?: boolean,
) => async (dispatch: ReduxDispatch<GlobalState>, getState: GetState<GlobalState>) => {
  const state: GlobalState = getState()

  const safeInstance = await getGnosisSafeInstanceAt(safeAddress)
  const from = userAccountSelector(state)
  const threshold = await safeInstance.getThreshold()
  const nonce = (await safeInstance.nonce()).toString()
  const isExecution = threshold.toNumber() === 1 || shouldExecute

  let txHash
  if (isExecution) {
    dispatch(showSnackbarMsg('Transaction has been submitted', 'success'))
    txHash = await executeTransaction(safeInstance, to, valueInWei, txData, CALL, nonce, from)
    dispatch(showSnackbarMsg('Transaction has been confirmed', 'success'))
  } else {
    dispatch(showSnackbarMsg('Approval transaction has been submitted', 'success'))
    txHash = await approveTransaction(safeInstance, to, valueInWei, txData, CALL, nonce, from)
    dispatch(showSnackbarMsg('Approval transaction has been confirmed', 'success'))
  }

  if (!process.env.NODE_ENV === 'test') {
    dispatch(fetchTransactions(safeAddress))
  }

  return txHash
}

export default createTransaction
