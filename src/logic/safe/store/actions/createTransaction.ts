import { push } from 'connected-react-router'
import { ThunkAction } from 'redux-thunk'

import { onboardUser } from 'src/components/ConnectButton'
import { decodeMethods } from 'src/logic/contracts/methodIds'
import { getGnosisSafeInstanceAt } from 'src/logic/contracts/safeContracts'
import { getNotificationsFromTxType } from 'src/logic/notifications'
import {
  CALL,
  getApprovalTransaction,
  getExecutionTransaction,
  saveTxToHistory,
  tryOffchainSigning,
} from 'src/logic/safe/transactions'
import { estimateGasForTransactionCreation } from 'src/logic/safe/transactions/gas'
import { getCurrentSafeVersion } from 'src/logic/safe/utils/safeVersion'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { EMPTY_DATA } from 'src/logic/wallets/ethTransactions'
import { providerSelector } from 'src/logic/wallets/store/selectors'
import { SAFELIST_ADDRESS } from 'src/routes/routes'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import closeSnackbarAction from 'src/logic/notifications/store/actions/closeSnackbar'
import {
  removeTxFromStore,
  storeSignedTx,
  storeExecutedTx,
} from 'src/logic/safe/store/actions/transactions/pendingTransactions'
import {
  generateSafeTxHash,
  mockTransaction,
  TxToMock,
} from 'src/logic/safe/store/actions/transactions/utils/transactionHelpers'
import { getLastTx, getNewTxNonce, shouldExecuteTransaction } from 'src/logic/safe/store/actions/utils'
import { getErrorMessage } from 'src/test/utils/ethereumErrors'
import fetchTransactions from './transactions/fetchTransactions'
import { TxArgs } from 'src/logic/safe/store/models/types/transaction'
import { AnyAction } from 'redux'
import { PayableTx } from 'src/types/contracts/types.d'
import { AppReduxState } from 'src/store'
import { Dispatch, DispatchReturn } from './types'
import { checkIfOffChainSignatureIsPossible, getPreValidatedSignatures } from 'src/logic/safe/safeTxSigner'

export interface CreateTransactionArgs {
  navigateToTransactionsTab?: boolean
  notifiedTransaction: string
  operation?: number
  origin?: string | null
  safeAddress: string
  to: string
  txData?: string
  txNonce?: number | string
  valueInWei: string
  safeTxGas?: number
}

type CreateTransactionAction = ThunkAction<Promise<void | string>, AppReduxState, DispatchReturn, AnyAction>
type ConfirmEventHandler = (safeTxHash: string) => void
type ErrorEventHandler = () => void
export const METAMASK_REJECT_CONFIRM_TX_ERROR_CODE = 4001

const createTransaction = (
  {
    safeAddress,
    to,
    valueInWei,
    txData = EMPTY_DATA,
    notifiedTransaction,
    txNonce,
    operation = CALL,
    navigateToTransactionsTab = true,
    origin = null,
    safeTxGas: safeTxGasArg,
  }: CreateTransactionArgs,
  onUserConfirm?: ConfirmEventHandler,
  onError?: ErrorEventHandler,
): CreateTransactionAction => async (dispatch: Dispatch, getState: () => AppReduxState): Promise<DispatchReturn> => {
  const state = getState()

  if (navigateToTransactionsTab) {
    dispatch(push(`${SAFELIST_ADDRESS}/${safeAddress}/transactions`))
  }

  const ready = await onboardUser()
  if (!ready) return

  const { account: from, hardwareWallet, smartContractWallet } = providerSelector(state)
  const safeInstance = await getGnosisSafeInstanceAt(safeAddress)
  const lastTx = await getLastTx(safeAddress)
  const nonce = txNonce ? txNonce.toString() : await getNewTxNonce(lastTx, safeInstance)
  const isExecution = await shouldExecuteTransaction(safeInstance, nonce, lastTx)
  const safeVersion = await getCurrentSafeVersion(safeInstance)
  let safeTxGas
  try {
    safeTxGas =
      safeTxGasArg || (await estimateGasForTransactionCreation(safeAddress, txData, to, valueInWei, operation))
  } catch (error) {
    safeTxGas = safeTxGasArg || 0
  }

  const sigs = getPreValidatedSignatures(from)
  const notificationsQueue = getNotificationsFromTxType(notifiedTransaction, origin)
  const beforeExecutionKey = dispatch(enqueueSnackbar(notificationsQueue.beforeExecution))

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
  const safeTxHash = generateSafeTxHash(safeAddress, txArgs)

  try {
    if (checkIfOffChainSignatureIsPossible(isExecution, smartContractWallet, safeVersion)) {
      const signature = await tryOffchainSigning(safeTxHash, { ...txArgs, safeAddress }, hardwareWallet)

      if (signature) {
        dispatch(closeSnackbarAction({ key: beforeExecutionKey }))
        dispatch(enqueueSnackbar(notificationsQueue.afterExecution.moreConfirmationsNeeded))
        dispatch(fetchTransactions(safeAddress))

        await saveTxToHistory({ ...txArgs, signature, origin })
        onUserConfirm?.(safeTxHash)
        return
      }
    }

    const tx = isExecution ? getExecutionTransaction(txArgs) : getApprovalTransaction(safeInstance, safeTxHash)
    const sendParams: PayableTx = { from, value: 0 }

    // if not set owner management tests will fail on ganache
    if (process.env.NODE_ENV === 'test') {
      sendParams.gas = '7000000'
    }

    const txToMock: TxToMock = {
      ...txArgs,
      confirmations: [], // this is used to determine if a tx is pending or not. See `calculateTransactionStatus` helper
      value: txArgs.valueInWei,
      safeTxHash,
      dataDecoded: decodeMethods(txArgs.data),
      submissionDate: new Date().toISOString(),
    }
    const mockedTx = await mockTransaction(txToMock, safeAddress, state)

    await tx
      .send(sendParams)
      .once('transactionHash', async (hash) => {
        onUserConfirm?.(safeTxHash)
        try {
          txHash = hash
          dispatch(closeSnackbarAction({ key: beforeExecutionKey }))

          pendingExecutionKey = dispatch(enqueueSnackbar(notificationsQueue.pendingExecution))

          await Promise.all([
            saveTxToHistory({ ...txArgs, txHash, origin }),
            storeSignedTx({ transaction: mockedTx, from, isExecution, safeAddress, dispatch, state }),
          ])
          dispatch(fetchTransactions(safeAddress))
        } catch (e) {
          removeTxFromStore(mockedTx, safeAddress, dispatch, state)
        }
      })
      .on('error', (error) => {
        dispatch(closeSnackbarAction({ key: pendingExecutionKey }))
        removeTxFromStore(mockedTx, safeAddress, dispatch, state)
        console.error('Tx error: ', error)

        onError?.()
      })
      .then(async (receipt) => {
        if (pendingExecutionKey) {
          dispatch(closeSnackbarAction({ key: pendingExecutionKey }))
        }

        dispatch(
          enqueueSnackbar(
            isExecution
              ? notificationsQueue.afterExecution.noMoreConfirmationsNeeded
              : notificationsQueue.afterExecution.moreConfirmationsNeeded,
          ),
        )

        await storeExecutedTx({ transaction: mockedTx, from, safeAddress, isExecution, receipt, dispatch, state })

        dispatch(fetchTransactions(safeAddress))

        return receipt.transactionHash
      })
  } catch (err) {
    const errorMsg = err.message
      ? `${notificationsQueue.afterExecutionError.message} - ${err.message}`
      : notificationsQueue.afterExecutionError.message

    dispatch(closeSnackbarAction({ key: beforeExecutionKey }))

    if (pendingExecutionKey) {
      dispatch(closeSnackbarAction({ key: pendingExecutionKey }))
    }

    dispatch(enqueueSnackbar({ key: err.code, message: errorMsg, options: { persist: true, variant: 'error' } }))

    if (err.code !== METAMASK_REJECT_CONFIRM_TX_ERROR_CODE) {
      const executeDataUsedSignatures = safeInstance.methods
        .execTransaction(to, valueInWei, txData, operation, 0, 0, 0, ZERO_ADDRESS, ZERO_ADDRESS, sigs)
        .encodeABI()
      const errMsg = await getErrorMessage(safeInstance.options.address, 0, executeDataUsedSignatures, from)
      console.error(`Error creating the TX - an attempt to get the error message: ${errMsg}`)
    }
  }

  return txHash
}

export default createTransaction
