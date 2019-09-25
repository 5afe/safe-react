// @flow
import type { Dispatch as ReduxDispatch, GetState } from 'redux'
import { EMPTY_DATA } from '~/logic/wallets/ethTransactions'
import { userAccountSelector } from '~/logic/wallets/store/selectors'
import fetchTransactions from '~/routes/safe/store/actions/fetchTransactions'
import { type GlobalState } from '~/store'
import { getGnosisSafeInstanceAt } from '~/logic/contracts/safeContracts'
import {
  getApprovalTransaction,
  getExecutionTransaction,
  CALL,
  type Notifications,
  DEFAULT_NOTIFICATIONS,
  TX_TYPE_CONFIRMATION,
  TX_TYPE_EXECUTION,
  saveTxToHistory,
} from '~/logic/safe/transactions'

const createTransaction = (
  safeAddress: string,
  to: string,
  valueInWei: string,
  txData: string = EMPTY_DATA,
  openSnackbar: Function,
  shouldExecute?: boolean,
  notifications?: Notifications = DEFAULT_NOTIFICATIONS,
) => async (dispatch: ReduxDispatch<GlobalState>, getState: GetState<GlobalState>) => {
  const state: GlobalState = getState()

  const safeInstance = await getGnosisSafeInstanceAt(safeAddress)
  const from = userAccountSelector(state)
  const threshold = await safeInstance.getThreshold()
  const nonce = (await safeInstance.nonce()).toString()
  const isExecution = threshold.toNumber() === 1 || shouldExecute

  let txHash
  try {
    if (isExecution) {
      const showNotification = () => openSnackbar(notifications.BEFORE_EXECUTION_OR_CREATION, 'success')
      const tx = await getExecutionTransaction(
        showNotification,
        safeInstance,
        to,
        valueInWei,
        txData,
        CALL,
        nonce,
        from,
      )

      await tx
        .send({
          from,
        })
        .once('transactionHash', (hash: string) => {
          txHash = hash
          openSnackbar(notifications.BEFORE_EXECUTION_OR_CREATION, 'success')
        })
        .on('error', (error) => {
          console.error('Tx error: ', error)
        })
        .then(async (receipt) => {
          await saveTxToHistory(
            safeInstance,
            to,
            valueInWei,
            txData,
            CALL,
            nonce,
            receipt.transactionHash,
            from,
            TX_TYPE_EXECUTION,
          )

          return receipt.transactionHash
        })
      openSnackbar(notifications.AFTER_EXECUTION, 'success')
    } else {
      const tx = await getApprovalTransaction(safeInstance, to, valueInWei, txData, CALL, nonce, from)

      await tx.send({
        from,
      })
        .once('transactionHash', (hash) => {
          txHash = hash
          openSnackbar(notifications.BEFORE_EXECUTION_OR_CREATION, 'success')
        })
        .on('error', (error) => {
          console.error('Tx error: ', error)
        })
        .then(async (receipt) => {
          await saveTxToHistory(
            safeInstance,
            to,
            valueInWei,
            txData,
            CALL,
            nonce,
            receipt.transactionHash,
            from,
            TX_TYPE_CONFIRMATION,
          )

          return receipt.transactionHash
        })

      openSnackbar(notifications.CREATED_MORE_CONFIRMATIONS_NEEDED, 'success')
    }
  } catch (err) {
    openSnackbar(notifications.ERROR, 'error')
    console.error(`Error while creating transaction: ${err}`)
  }

  dispatch(fetchTransactions(safeAddress))

  return txHash
}

export default createTransaction
