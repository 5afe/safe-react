// @flow
import type { Dispatch as ReduxDispatch, GetState } from 'redux'
import { type Transaction } from '~/routes/safe/store/models/transaction'
import { userAccountSelector } from '~/logic/wallets/store/selectors'
import fetchTransactions from '~/routes/safe/store/actions/fetchTransactions'
import { type GlobalState } from '~/store'
import { getGnosisSafeInstanceAt } from '~/logic/contracts/safeContracts'
import {
  type NotificationsQueue,
  getApprovalTransaction,
  getExecutionTransaction,
  CALL,
  saveTxToHistory,
  TX_TYPE_EXECUTION,
  TX_TYPE_CONFIRMATION,
} from '~/logic/safe/transactions'
import { getNofiticationsFromTxType } from '~/logic/notifications'
import { getErrorMessage } from '~/test/utils/ethereumErrors'

// https://gnosis-safe.readthedocs.io/en/latest/contracts/signatures.html#pre-validated-signatures
// https://github.com/gnosis/safe-contracts/blob/master/test/gnosisSafeTeamEdition.js#L26
const generateSignaturesFromTxConfirmations = (tx: Transaction, preApprovingOwner?: string) => {
  // The constant parts need to be sorted so that the recovered signers are sorted ascending
  // (natural order) by address (not checksummed).
  let confirmedAdresses = tx.confirmations.map((conf) => conf.owner.address)

  if (preApprovingOwner) {
    confirmedAdresses = confirmedAdresses.push(preApprovingOwner)
  }

  let sigs = '0x'
  confirmedAdresses.sort().forEach((addr) => {
    sigs += `000000000000000000000000${addr.replace(
      '0x',
      '',
    )}000000000000000000000000000000000000000000000000000000000000000001`
  })
  return sigs
}

const processTransaction = (
  safeAddress: string,
  tx: Transaction,
  userAddress: string,
  notifiedTransaction: NotifiedTransaction,
  enqueueSnackbar: Function,
  closeSnackbar: Function,
  approveAndExecute?: boolean,
) => async (dispatch: ReduxDispatch<GlobalState>, getState: GetState<GlobalState>) => {
  const state: GlobalState = getState()

  const safeInstance = await getGnosisSafeInstanceAt(safeAddress)
  const from = userAccountSelector(state)
  const nonce = (await safeInstance.nonce()).toString()
  const threshold = (await safeInstance.getThreshold()).toNumber()
  const shouldExecute = threshold === tx.confirmations.size || approveAndExecute

  let sigs = generateSignaturesFromTxConfirmations(tx, approveAndExecute && userAddress)
  // https://gnosis-safe.readthedocs.io/en/latest/contracts/signatures.html#pre-validated-signatures
  if (!sigs) {
    sigs = `0x000000000000000000000000${from.replace(
      '0x',
      '',
    )}000000000000000000000000000000000000000000000000000000000000000001`
  }

  const notificationsQueue: NotificationsQueue = getNofiticationsFromTxType(notifiedTransaction)
  const beforeExecutionKey = enqueueSnackbar(
    notificationsQueue.beforeExecution.message,
    notificationsQueue.beforeExecution.options,
  )
  let pendingExecutionKey

  let txHash
  let transaction
  try {
    if (shouldExecute) {
      transaction = await getExecutionTransaction(
        safeInstance,
        tx.recipient,
        tx.value,
        tx.data,
        CALL,
        nonce,
        from,
        sigs,
      )
    } else {
      transaction = await getApprovalTransaction(safeInstance, tx.recipient, tx.value, tx.data, CALL, nonce, from)
    }

    const sendParams = { from }
    // if not set owner management tests will fail on ganache
    if (process.env.NODE_ENV === 'test') {
      sendParams.gas = '7000000'
    }

    await transaction
      .send(sendParams)
      .once('transactionHash', (hash) => {
        txHash = hash
        closeSnackbar(beforeExecutionKey)
        pendingExecutionKey = enqueueSnackbar(
          notificationsQueue.pendingExecution.single.message,
          notificationsQueue.pendingExecution.single.options,
        )
      })
      .on('error', (error) => {
        console.error('Processing transaction error: ', error)
      })
      .then(async (receipt) => {
        closeSnackbar(pendingExecutionKey)
        await saveTxToHistory(
          safeInstance,
          tx.recipient,
          tx.value,
          tx.data,
          CALL,
          nonce,
          receipt.transactionHash,
          from,
          shouldExecute ? TX_TYPE_EXECUTION : TX_TYPE_CONFIRMATION,
        )
        enqueueSnackbar(notificationsQueue.afterExecution.message, notificationsQueue.afterExecution.options)

        return receipt.transactionHash
      })
  } catch (err) {
    closeSnackbar(beforeExecutionKey)
    closeSnackbar(pendingExecutionKey)
    enqueueSnackbar(notificationsQueue.afterExecutionError.message, notificationsQueue.afterExecutionError.options)

    const executeData = safeInstance.contract.methods.approveHash(txHash).encodeABI()
    const errMsg = await getErrorMessage(safeInstance.address, 0, executeData, from)
    console.error(`Error executing the TX: ${errMsg}`)
  }

  dispatch(fetchTransactions(safeAddress))

  return txHash
}

export default processTransaction
