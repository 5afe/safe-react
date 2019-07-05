// @flow
import type { Dispatch as ReduxDispatch, GetState } from 'redux'
import { type Transaction } from '~/routes/safe/store/models/transaction'
import { userAccountSelector } from '~/logic/wallets/store/selectors'
import fetchTransactions from '~/routes/safe/store/actions/fetchTransactions'
import { type GlobalState } from '~/store'
import { getGnosisSafeInstanceAt } from '~/logic/contracts/safeContracts'
import { approveTransaction, executeTransaction, CALL } from '~/logic/safe/transactions'

const processTransaction = (
  safeAddress: string,
  tx: Transaction,
  openSnackbar: Function,
  shouldExecute?: boolean,
) => async (dispatch: ReduxDispatch<GlobalState>, getState: GetState<GlobalState>) => {
  const state: GlobalState = getState()

  const safeInstance = await getGnosisSafeInstanceAt(safeAddress)
  const from = userAccountSelector(state)
  const nonce = (await safeInstance.nonce()).toString()

  let txHash
  if (shouldExecute) {
    openSnackbar('Transaction has been submitted', 'success')
    txHash = await executeTransaction(safeInstance, tx.recipient, tx.value, tx.data, CALL, nonce, from)
    openSnackbar('Transaction has been confirmed', 'success')
  } else {
    openSnackbar('Approval transaction has been submitted', 'success')
    txHash = await approveTransaction(safeInstance, tx.recipient, tx.value, tx.data, CALL, nonce, from)
    openSnackbar('Approval transaction has been confirmed', 'success')
  }
  dispatch(fetchTransactions(safeAddress))

  return txHash
}

export default processTransaction
