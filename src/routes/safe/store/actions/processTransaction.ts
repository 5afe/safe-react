import { fromJS } from 'immutable'
import semverSatisfies from 'semver/functions/satisfies'

import { getGnosisSafeInstanceAt } from 'src/logic/contracts/safeContracts'
import { getNotificationsFromTxType, showSnackbar } from 'src/logic/notifications'
import { generateSignaturesFromTxConfirmations } from 'src/logic/safe/safeTxSigner'
import { getApprovalTransaction, getExecutionTransaction, saveTxToHistory } from 'src/logic/safe/transactions'
import { SAFE_VERSION_FOR_OFFCHAIN_SIGNATURES, tryOffchainSigning } from 'src/logic/safe/transactions/offchainSigner'
import { getCurrentSafeVersion } from 'src/logic/safe/utils/safeVersion'
import { providerSelector } from 'src/logic/wallets/store/selectors'
import fetchSafe from 'src/routes/safe/store/actions/fetchSafe'
import fetchTransactions from 'src/routes/safe/store/actions/transactions/fetchTransactions'
import {
  isCancelTransaction,
  mockTransaction,
  TxToMock,
} from 'src/routes/safe/store/actions/transactions/utils/transactionHelpers'
import { getLastTx, getNewTxNonce, shouldExecuteTransaction } from 'src/routes/safe/store/actions/utils'

import { getErrorMessage } from 'src/test/utils/ethereumErrors'
import { makeConfirmation } from '../models/confirmation'
import { storeTx } from './createTransaction'
import { TransactionStatus } from '../models/types/transaction'

const processTransaction = ({
  approveAndExecute,
  closeSnackbar,
  enqueueSnackbar,
  notifiedTransaction,
  safeAddress,
  tx,
  userAddress,
}) => async (dispatch, getState) => {
  const state = getState()

  const { account: from, hardwareWallet, smartContractWallet } = providerSelector(state)
  const safeInstance = await getGnosisSafeInstanceAt(safeAddress)
  const lastTx = await getLastTx(safeAddress)
  const nonce = await getNewTxNonce(null, lastTx, safeInstance)
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
  const beforeExecutionKey = showSnackbar(notificationsQueue.beforeExecution, enqueueSnackbar, closeSnackbar)
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
      const signature = await tryOffchainSigning({ ...txArgs, safeAddress }, hardwareWallet)

      if (signature) {
        closeSnackbar(beforeExecutionKey)

        await saveTxToHistory({ ...txArgs, signature })
        showSnackbar(notificationsQueue.afterExecution.moreConfirmationsNeeded, enqueueSnackbar, closeSnackbar)

        dispatch(fetchTransactions(safeAddress))
        return
      }
    }

    transaction = isExecution ? await getExecutionTransaction(txArgs) : await getApprovalTransaction(txArgs)

    const sendParams: any = { from, value: 0 }

    // if not set owner management tests will fail on ganache
    if (process.env.NODE_ENV === 'test') {
      sendParams.gas = '7000000'
    }

    const txToMock: TxToMock = {
      ...txArgs,
      confirmations: [], // this is used to determine if a tx is pending or not. See `calculateTransactionStatus` helper
      value: txArgs.valueInWei,
    }
    const mockedTx = await mockTransaction(txToMock, safeAddress, state)

    await transaction
      .send(sendParams)
      .once('transactionHash', async (hash) => {
        txHash = hash
        closeSnackbar(beforeExecutionKey)

        pendingExecutionKey = showSnackbar(notificationsQueue.pendingExecution, enqueueSnackbar, closeSnackbar)

        try {
          await Promise.all([
            saveTxToHistory({ ...txArgs, txHash }),
            storeTx(
              mockedTx.updateIn(
                ['ownersWithPendingActions', mockedTx.isCancellationTx ? 'reject' : 'confirm'],
                (previous) => previous.push(from),
              ),
              safeAddress,
              dispatch,
              state,
            ),
          ])
          dispatch(fetchTransactions(safeAddress))
        } catch (e) {
          closeSnackbar(pendingExecutionKey)
          await storeTx(tx, safeAddress, dispatch, state)
          console.error(e)
        }
      })
      .on('error', (error) => {
        closeSnackbar(pendingExecutionKey)
        storeTx(tx, safeAddress, dispatch, state)
        console.error('Processing transaction error: ', error)
      })
      .then(async (receipt) => {
        if (pendingExecutionKey) {
          closeSnackbar(pendingExecutionKey)
        }

        showSnackbar(
          isExecution
            ? notificationsQueue.afterExecution.noMoreConfirmationsNeeded
            : notificationsQueue.afterExecution.moreConfirmationsNeeded,
          enqueueSnackbar,
          closeSnackbar,
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
            })
          : mockedTx.set('status', TransactionStatus.AWAITING_CONFIRMATIONS)

        await storeTx(
          toStoreTx.withMutations((record) => {
            record
              .set('confirmations', fromJS([...tx.confirmations, makeConfirmation({ owner: from })]))
              .updateIn(['ownersWithPendingActions', toStoreTx.isCancellationTx ? 'reject' : 'confirm'], (previous) =>
                previous.pop(from),
              )
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
      closeSnackbar(beforeExecutionKey)

      if (pendingExecutionKey) {
        closeSnackbar(pendingExecutionKey)
      }

      showSnackbar(errorMsg, enqueueSnackbar, closeSnackbar)

      const executeData = safeInstance.contract.methods.approveHash(txHash).encodeABI()
      const errMsg = await getErrorMessage(safeInstance.address, 0, executeData, from)
      console.error(`Error executing the TX: ${errMsg}`)
    }
  }

  return txHash
}

export default processTransaction
