import semverSatisfies from 'semver/functions/satisfies'

import { getGnosisSafeInstanceAt } from 'src/logic/contracts/safeContracts'
import { getNotificationsFromTxType } from 'src/logic/notifications'
import { generateSignaturesFromTxConfirmations } from 'src/logic/safe/safeTxSigner'
import { getApprovalTransaction, getExecutionTransaction, saveTxToHistory } from 'src/logic/safe/transactions'
import { SAFE_VERSION_FOR_OFFCHAIN_SIGNATURES, tryOffchainSigning } from 'src/logic/safe/transactions/offchainSigner'
import { getCurrentSafeVersion } from 'src/logic/safe/utils/safeVersion'
import { providerSelector } from 'src/logic/wallets/store/selectors'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import closeSnackbarAction from 'src/logic/notifications/store/actions/closeSnackbar'
import fetchSafe from 'src/logic/safe/store/actions/fetchSafe'
import fetchTransactions from 'src/logic/safe/store/actions/transactions/fetchTransactions'
import {
  isCancelTransaction,
  mockTransaction,
  TxToMock,
} from 'src/logic/safe/store/actions/transactions/utils/transactionHelpers'
import { getLastTx, getNewTxNonce, shouldExecuteTransaction } from 'src/logic/safe/store/actions/utils'

import { getErrorMessage } from 'src/test/utils/ethereumErrors'
import { storeTx } from './createTransaction'
import { TransactionStatus } from 'src/logic/safe/store/models/types/transaction'
import { makeConfirmation } from 'src/logic/safe/store/models/confirmation'

const processTransaction = ({ approveAndExecute, notifiedTransaction, safeAddress, tx, userAddress }) => async (
  dispatch,
  getState,
) => {
  const state = getState()

  const { account: from, hardwareWallet, smartContractWallet } = providerSelector(state)
  const safeInstance = await getGnosisSafeInstanceAt(safeAddress)

  const lastTx = await getLastTx(safeAddress)
  const nonce = await getNewTxNonce(undefined, lastTx, safeInstance)
  const isExecution = approveAndExecute || (await shouldExecuteTransaction(safeInstance, nonce, lastTx))
  const safeVersion = await getCurrentSafeVersion(safeInstance)

  let sigs = generateSignaturesFromTxConfirmations(tx.confirmations, approveAndExecute && userAddress)
  // https://docs.gnosis.io/safe/docs/docs5/#pre-validated-signatures
  if (!sigs) {
    sigs = `0x000000000000000000000000${from.replace(
      '0x',
      '',
    )}000000000000000000000000000000000000000000000000000000000000000001`
  }

  const notificationsQueue = getNotificationsFromTxType(notifiedTransaction, tx.origin)
  const beforeExecutionKey = dispatch(enqueueSnackbar(notificationsQueue.beforeExecution))
  let pendingExecutionKey

  let txHash
  let transaction
  const txArgs = {
    ...tx.toJS(), // merge the previous tx with new data
    safeInstance,
    to: tx.recipient,
    valueInWei: tx.value,
    data: tx.data,
    operation: tx.operation,
    nonce: tx.nonce,
    safeTxGas: tx.safeTxGas,
    baseGas: tx.baseGas,
    gasPrice: tx.gasPrice || '0',
    gasToken: tx.gasToken,
    refundReceiver: tx.refundReceiver,
    sender: from,
    sigs,
  }

  try {
    // Here we're checking that safe contract version is greater or equal 1.1.1, but
    // theoretically EIP712 should also work for 1.0.0 contracts
    // Also, offchain signatures are not working for ledger/trezor wallet because of a bug in their library:
    // https://github.com/LedgerHQ/ledgerjs/issues/378
    // Couldn't find an issue for trezor but the error is almost the same
    const canTryOffchainSigning =
      !isExecution && !smartContractWallet && semverSatisfies(safeVersion, SAFE_VERSION_FOR_OFFCHAIN_SIGNATURES)
    if (canTryOffchainSigning) {
      const signature = await tryOffchainSigning(tx.safeTxHash, { ...txArgs, safeAddress }, hardwareWallet)

      if (signature) {
        dispatch(closeSnackbarAction(beforeExecutionKey))

        await saveTxToHistory({ ...txArgs, signature })
        // TODO: while we wait for the tx to be stored in the service and later update the tx info
        //  we should update the tx status in the store to disable owners' action buttons
        dispatch(enqueueSnackbar(notificationsQueue.afterExecution.moreConfirmationsNeeded))

        dispatch(fetchTransactions(safeAddress))
        return
      }
    }

    transaction = isExecution
      ? await getExecutionTransaction(txArgs)
      : await getApprovalTransaction(safeInstance, tx.safeTxHash)

    const sendParams: any = { from, value: 0 }

    // if not set owner management tests will fail on ganache
    if (process.env.NODE_ENV === 'test') {
      sendParams.gas = '7000000'
    }

    const txToMock: TxToMock = {
      ...txArgs,
      value: txArgs.valueInWei,
    }
    const mockedTx = await mockTransaction(txToMock, safeAddress, state)

    await transaction
      .send(sendParams)
      .once('transactionHash', async (hash: string) => {
        txHash = hash
        dispatch(closeSnackbarAction(beforeExecutionKey))

        pendingExecutionKey = dispatch(enqueueSnackbar(notificationsQueue.pendingExecution))

        try {
          await Promise.all([
            saveTxToHistory({ ...txArgs, txHash }),
            storeTx(
              mockedTx.withMutations((record) => {
                record
                  .updateIn(
                    ['ownersWithPendingActions', mockedTx.isCancellationTx ? 'reject' : 'confirm'],
                    (previous) => previous.push(from),
                  )
                  .set('status', TransactionStatus.PENDING)
              }),
              safeAddress,
              dispatch,
              state,
            ),
          ])
          dispatch(fetchTransactions(safeAddress))
        } catch (e) {
          dispatch(closeSnackbarAction(pendingExecutionKey))
          await storeTx(tx, safeAddress, dispatch, state)
          console.error(e)
        }
      })
      .on('error', (error) => {
        dispatch(closeSnackbarAction(pendingExecutionKey))
        storeTx(tx, safeAddress, dispatch, state)
        console.error('Processing transaction error: ', error)
      })
      .then(async (receipt) => {
        if (pendingExecutionKey) {
          dispatch(closeSnackbarAction(pendingExecutionKey))
        }

        dispatch(
          enqueueSnackbar(
            isExecution
              ? notificationsQueue.afterExecution.noMoreConfirmationsNeeded
              : notificationsQueue.afterExecution.moreConfirmationsNeeded,
          ),
        )

        const toStoreTx = isExecution
          ? mockedTx.withMutations((record) => {
              record
                .set('executionTxHash', receipt.transactionHash)
                .set('blockNumber', receipt.blockNumber)
                .set('executionDate', record.submissionDate)
                .set('executor', from)
                .set('isExecuted', true)
                .set('isSuccessful', receipt.status)
                .set(
                  'status',
                  receipt.status
                    ? isCancelTransaction(record, safeAddress)
                      ? TransactionStatus.CANCELLED
                      : TransactionStatus.SUCCESS
                    : TransactionStatus.FAILED,
                )
                .updateIn(['ownersWithPendingActions', 'reject'], (prev) => prev.clear())
                .updateIn(['ownersWithPendingActions', 'confirm'], (prev) => prev.clear())
            })
          : mockedTx.withMutations((record) => {
              record
                .updateIn(['ownersWithPendingActions', toStoreTx.isCancellationTx ? 'reject' : 'confirm'], (previous) =>
                  previous.pop(),
                )
                .set('status', TransactionStatus.AWAITING_CONFIRMATIONS)
            })

        await storeTx(
          toStoreTx.update('confirmations', (confirmations) => {
            const index = confirmations.findIndex(({ owner }) => owner === from)
            return index === -1 ? confirmations.push(makeConfirmation({ owner: from })) : confirmations
          }),
          safeAddress,
          dispatch,
          state,
        )

        dispatch(fetchTransactions(safeAddress))

        if (isExecution) {
          dispatch(fetchSafe(safeAddress))
        }

        return receipt.transactionHash
      })
  } catch (err) {
    const errorMsg = err.message
      ? `${notificationsQueue.afterExecutionError.message} - ${err.message}`
      : notificationsQueue.afterExecutionError.message
    console.error(err)

    if (txHash !== undefined) {
      dispatch(closeSnackbarAction(beforeExecutionKey))

      if (pendingExecutionKey) {
        dispatch(closeSnackbarAction(pendingExecutionKey))
      }

      dispatch(enqueueSnackbar(errorMsg))

      const executeData = safeInstance.methods.approveHash(txHash).encodeABI()
      const errMsg = await getErrorMessage(safeInstance.options.address, 0, executeData, from)
      console.error(`Error executing the TX: ${errMsg}`)
    }
  }

  return txHash
}

export default processTransaction
