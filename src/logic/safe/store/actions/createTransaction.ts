import { push } from 'connected-react-router'
import { List, Map } from 'immutable'
import { WithSnackbarProps } from 'notistack'
import { batch } from 'react-redux'
import semverSatisfies from 'semver/functions/satisfies'
import { ThunkAction } from 'redux-thunk'

import { onboardUser } from 'src/components/ConnectButton'
import { getGnosisSafeInstanceAt } from 'src/logic/contracts/safeContracts'
import { getNotificationsFromTxType, showSnackbar } from 'src/logic/notifications'
import {
  CALL,
  getApprovalTransaction,
  getExecutionTransaction,
  SAFE_VERSION_FOR_OFFCHAIN_SIGNATURES,
  saveTxToHistory,
  tryOffchainSigning,
} from 'src/logic/safe/transactions'
import { estimateSafeTxGas } from 'src/logic/safe/transactions/gasNew'
import { getCurrentSafeVersion } from 'src/logic/safe/utils/safeVersion'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { EMPTY_DATA } from 'src/logic/wallets/ethTransactions'
import { providerSelector } from 'src/logic/wallets/store/selectors'
import { SAFELIST_ADDRESS } from 'src/routes/routes'
import { addOrUpdateCancellationTransactions } from 'src/logic/safe/store/actions/transactions/addOrUpdateCancellationTransactions'
import { addOrUpdateTransactions } from 'src/logic/safe/store/actions/transactions/addOrUpdateTransactions'
import { removeCancellationTransaction } from 'src/logic/safe/store/actions/transactions/removeCancellationTransaction'
import { removeTransaction } from 'src/logic/safe/store/actions/transactions/removeTransaction'
import {
  generateSafeTxHash,
  mockTransaction,
  TxToMock,
} from 'src/logic/safe/store/actions/transactions/utils/transactionHelpers'
import { getLastTx, getNewTxNonce, shouldExecuteTransaction } from 'src/logic/safe/store/actions/utils'
import { getErrorMessage } from 'src/test/utils/ethereumErrors'
import { makeConfirmation } from '../models/confirmation'
import fetchTransactions from './transactions/fetchTransactions'
import { safeTransactionsSelector } from 'src/logic/safe/store/selectors'
import { Transaction, TransactionStatus, TxArgs } from 'src/logic/safe/store/models/types/transaction'
import { AnyAction } from 'redux'
import { PayableTx } from 'src/types/contracts/types.d'
import { AppReduxState } from 'src/store'
import { Dispatch } from './types'

export const removeTxFromStore = (
  tx: Transaction,
  safeAddress: string,
  dispatch: Dispatch,
  state: AppReduxState,
): void => {
  if (tx.isCancellationTx) {
    const newTxStatus = TransactionStatus.AWAITING_YOUR_CONFIRMATION
    const transactions = safeTransactionsSelector(state)
    const txsToUpdate = transactions
      .filter((transaction) => Number(transaction.nonce) === Number(tx.nonce))
      .withMutations((list) => list.map((tx) => tx.set('status', newTxStatus)))

    batch(() => {
      dispatch(addOrUpdateTransactions({ safeAddress, transactions: txsToUpdate }))
      dispatch(removeCancellationTransaction({ safeAddress, transaction: tx }))
    })
  } else {
    dispatch(removeTransaction({ safeAddress, transaction: tx }))
  }
}

export const storeTx = async (
  tx: Transaction,
  safeAddress: string,
  dispatch: Dispatch,
  state: AppReduxState,
): Promise<void> => {
  if (tx.isCancellationTx) {
    let newTxStatus: TransactionStatus = TransactionStatus.AWAITING_YOUR_CONFIRMATION

    if (tx.isExecuted) {
      newTxStatus = TransactionStatus.CANCELLED
    } else if (tx.status === TransactionStatus.PENDING) {
      newTxStatus = tx.status
    }

    const transactions = safeTransactionsSelector(state)
    const txsToUpdate = transactions
      .filter((transaction) => Number(transaction.nonce) === Number(tx.nonce))
      .withMutations((list) =>
        list.map((tx) => tx.set('status', newTxStatus).set('cancelled', newTxStatus === TransactionStatus.CANCELLED)),
      )

    batch(() => {
      dispatch(addOrUpdateCancellationTransactions({ safeAddress, transactions: Map({ [`${tx.nonce}`]: tx }) }))
      dispatch(addOrUpdateTransactions({ safeAddress, transactions: txsToUpdate }))
    })
  } else {
    dispatch(addOrUpdateTransactions({ safeAddress, transactions: List([tx]) }))
  }
}

interface CreateTransaction extends WithSnackbarProps {
  navigateToTransactionsTab?: boolean
  notifiedTransaction: string
  operation?: number
  origin?: string
  safeAddress: string
  to: string
  txData?: string
  txNonce?: number | string
  valueInWei: string
}

type CreateTransactionAction = ThunkAction<Promise<void>, AppReduxState, undefined, AnyAction>

const createTransaction = ({
  safeAddress,
  to,
  valueInWei,
  txData = EMPTY_DATA,
  notifiedTransaction,
  enqueueSnackbar,
  closeSnackbar,
  txNonce,
  operation = CALL,
  navigateToTransactionsTab = true,
  origin = null,
}: CreateTransaction): CreateTransactionAction => async (
  dispatch: Dispatch,
  getState: () => AppReduxState,
): Promise<void> => {
  const state = getState()

  if (navigateToTransactionsTab) {
    dispatch(push(`${SAFELIST_ADDRESS}/${safeAddress}/transactions`))
  }

  const ready = await onboardUser()
  if (!ready) return

  const { account: from, hardwareWallet, smartContractWallet } = providerSelector(state)
  const safeInstance = await getGnosisSafeInstanceAt(safeAddress)
  const lastTx = await getLastTx(safeAddress)
  const nonce = await getNewTxNonce(txNonce?.toString(), lastTx, safeInstance)
  const isExecution = await shouldExecuteTransaction(safeInstance, nonce, lastTx)
  const safeVersion = await getCurrentSafeVersion(safeInstance)
  const safeTxGas = await estimateSafeTxGas(safeInstance, safeAddress, txData, to, valueInWei, operation)

  // https://docs.gnosis.io/safe/docs/docs5/#pre-validated-signatures
  const sigs = `0x000000000000000000000000${from.replace(
    '0x',
    '',
  )}000000000000000000000000000000000000000000000000000000000000000001`

  const notificationsQueue = getNotificationsFromTxType(notifiedTransaction, origin)
  const beforeExecutionKey = showSnackbar(notificationsQueue.beforeExecution, enqueueSnackbar, closeSnackbar)

  let pendingExecutionKey

  let txHash
  const txArgs: TxArgs = {
    safeInstance,
    to,
    valueInWei,
    data: txData,
    operation,
    nonce: Number.parseInt(nonce),
    safeTxGas,
    baseGas: 0,
    gasPrice: '0',
    gasToken: ZERO_ADDRESS,
    refundReceiver: ZERO_ADDRESS,
    sender: from,
    sigs,
  }

  try {
    // Here we're checking that safe contract version is greater or equal 1.1.1, but
    // theoretically EIP712 should also work for 1.0.0 contracts
    const canTryOffchainSigning =
      !isExecution && !smartContractWallet && semverSatisfies(safeVersion, SAFE_VERSION_FOR_OFFCHAIN_SIGNATURES)
    if (canTryOffchainSigning) {
      const signature = await tryOffchainSigning({ ...txArgs, safeAddress }, hardwareWallet)

      if (signature) {
        closeSnackbar(beforeExecutionKey)

        await saveTxToHistory({ ...txArgs, signature, origin })
        showSnackbar(notificationsQueue.afterExecution.moreConfirmationsNeeded, enqueueSnackbar, closeSnackbar)

        dispatch(fetchTransactions(safeAddress))
        return
      }
    }

    const tx = isExecution ? await getExecutionTransaction(txArgs) : await getApprovalTransaction(txArgs)
    const sendParams: PayableTx = { from, value: 0 }

    // if not set owner management tests will fail on ganache
    if (process.env.NODE_ENV === 'test') {
      sendParams.gas = '7000000'
    }

    const txToMock: TxToMock = {
      ...txArgs,
      confirmations: [], // this is used to determine if a tx is pending or not. See `calculateTransactionStatus` helper
      value: txArgs.valueInWei,
      safeTxHash: generateSafeTxHash(safeAddress, txArgs),
      submissionDate: new Date().toISOString(),
    }
    const mockedTx = await mockTransaction(txToMock, safeAddress, state)

    await tx
      .send(sendParams)
      .once('transactionHash', async (hash) => {
        try {
          txHash = hash
          closeSnackbar(beforeExecutionKey)

          pendingExecutionKey = showSnackbar(notificationsQueue.pendingExecution, enqueueSnackbar, closeSnackbar)

          await Promise.all([
            saveTxToHistory({ ...txArgs, txHash, origin }),
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
          removeTxFromStore(mockedTx, safeAddress, dispatch, state)
        }
      })
      .on('error', (error) => {
        closeSnackbar(pendingExecutionKey)
        removeTxFromStore(mockedTx, safeAddress, dispatch, state)
        console.error('Tx error: ', error)
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
                .set('executor', from)
                .set('isExecuted', true)
                .set('isSuccessful', receipt.status)
                .set('status', receipt.status ? TransactionStatus.SUCCESS : TransactionStatus.FAILED)
            })
          : mockedTx.set('status', TransactionStatus.AWAITING_CONFIRMATIONS)

        await storeTx(
          toStoreTx.withMutations((record) => {
            record
              .set('confirmations', List([makeConfirmation({ owner: from })]))
              .updateIn(['ownersWithPendingActions', toStoreTx.isCancellationTx ? 'reject' : 'confirm'], (previous) =>
                previous.pop(from),
              )
          }),
          safeAddress,
          dispatch,
          state,
        )
        dispatch(fetchTransactions(safeAddress))

        return receipt.transactionHash
      })
  } catch (err) {
    const errorMsg = err.message
      ? `${notificationsQueue.afterExecutionError.message} - ${err.message}`
      : notificationsQueue.afterExecutionError.message

    console.error(`Error creating the TX: `, err)
    closeSnackbar(beforeExecutionKey)

    if (pendingExecutionKey) {
      closeSnackbar(pendingExecutionKey)
    }

    showSnackbar(errorMsg, enqueueSnackbar, closeSnackbar)

    const executeDataUsedSignatures = safeInstance.methods
      .execTransaction(to, valueInWei, txData, operation, 0, 0, 0, ZERO_ADDRESS, ZERO_ADDRESS, sigs)
      .encodeABI()
    const errMsg = await getErrorMessage(safeInstance.options.address, 0, executeDataUsedSignatures, from)
    console.error(`Error creating the TX - an attempt to get the error message: ${errMsg}`)
  }

  return txHash
}

export default createTransaction
