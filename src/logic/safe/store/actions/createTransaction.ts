import { push } from 'connected-react-router'
import { ThunkAction } from 'redux-thunk'

import { onboardUser } from 'src/components/ConnectButton'
import { getGnosisSafeInstanceAt } from 'src/logic/contracts/safeContracts'
import { getNotificationsFromTxType } from 'src/logic/notifications'
import {
  CALL,
  getApprovalTransaction,
  getExecutionTransaction,
  saveTxToHistory,
  tryOffChainSigning,
} from 'src/logic/safe/transactions'
import { estimateSafeTxGas } from 'src/logic/safe/transactions/gas'
import * as aboutToExecuteTx from 'src/logic/safe/utils/aboutToExecuteTx'
import { getCurrentSafeVersion } from 'src/logic/safe/utils/safeVersion'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { EMPTY_DATA } from 'src/logic/wallets/ethTransactions'
import { providerSelector } from 'src/logic/wallets/store/selectors'
import { SAFELIST_ADDRESS } from 'src/routes/routes'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import closeSnackbarAction from 'src/logic/notifications/store/actions/closeSnackbar'
import { generateSafeTxHash } from 'src/logic/safe/store/actions/transactions/utils/transactionHelpers'
import { getLastTx, getNewTxNonce, shouldExecuteTransaction } from 'src/logic/safe/store/actions/utils'
import { getErrorMessage } from 'src/test/utils/ethereumErrors'
import fetchTransactions from './transactions/fetchTransactions'
import { TxArgs } from 'src/logic/safe/store/models/types/transaction'
import { AnyAction } from 'redux'
import { PayableTx } from 'src/types/contracts/types.d'
import { AppReduxState } from 'src/store'
import { Dispatch, DispatchReturn } from './types'
import { checkIfOffChainSignatureIsPossible, getPreValidatedSignatures } from 'src/logic/safe/safeTxSigner'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'

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
  ethParameters?: Pick<TxParameters, 'ethNonce' | 'ethGasLimit' | 'ethGasPriceInGWei'>
}

type CreateTransactionAction = ThunkAction<Promise<void | string>, AppReduxState, DispatchReturn, AnyAction>
type ConfirmEventHandler = (safeTxHash: string) => void
type ErrorEventHandler = () => void
export const METAMASK_REJECT_CONFIRM_TX_ERROR_CODE = 4001

export const createTransaction = (
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
    ethParameters,
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
  const safeInstance = getGnosisSafeInstanceAt(safeAddress)
  const lastTx = await getLastTx(safeAddress)
  const nextNonce = await getNewTxNonce(lastTx, safeInstance)
  const nonce = txNonce !== undefined ? txNonce.toString() : nextNonce

  const isExecution = await shouldExecuteTransaction(safeInstance, nonce, lastTx)
  const safeVersion = await getCurrentSafeVersion(safeInstance)
  let safeTxGas = safeTxGasArg || 0
  try {
    if (safeTxGasArg === undefined) {
      safeTxGas = await estimateSafeTxGas({ safeAddress, txData, txRecipient: to, txAmount: valueInWei, operation })
    }
  } catch (error) {
    safeTxGas = safeTxGasArg || 0
  }

  const sigs = getPreValidatedSignatures(from)
  const notificationsQueue = getNotificationsFromTxType(notifiedTransaction, origin)
  const beforeExecutionKey = dispatch(enqueueSnackbar(notificationsQueue.beforeExecution))

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
      const signature = await tryOffChainSigning(safeTxHash, { ...txArgs, safeAddress }, hardwareWallet, safeVersion)

      if (signature) {
        dispatch(closeSnackbarAction({ key: beforeExecutionKey }))
        dispatch(fetchTransactions(safeAddress))

        await saveTxToHistory({ ...txArgs, signature, origin })
        onUserConfirm?.(safeTxHash)
        return
      }
    }

    const tx = isExecution ? getExecutionTransaction(txArgs) : getApprovalTransaction(safeInstance, safeTxHash)
    const sendParams: PayableTx = {
      from,
      value: 0,
      gas: ethParameters?.ethGasLimit,
      gasPrice: ethParameters?.ethGasPriceInGWei,
      nonce: ethParameters?.ethNonce,
    }

    await tx
      .send(sendParams)
      .once('transactionHash', async (hash) => {
        onUserConfirm?.(safeTxHash)

        txHash = hash
        dispatch(closeSnackbarAction({ key: beforeExecutionKey }))

        await saveTxToHistory({ ...txArgs, txHash, origin })

        // store the pending transaction's nonce
        isExecution && aboutToExecuteTx.setNonce(txArgs.nonce)

        dispatch(fetchTransactions(safeAddress))
      })
      .on('error', (error) => {
        console.error('Tx error: ', error)

        onError?.()
      })
      .then(async (receipt) => {
        dispatch(fetchTransactions(safeAddress))

        return receipt.transactionHash
      })
  } catch (err) {
    const errorMsg = err.message
      ? `${notificationsQueue.afterExecutionError.message} - ${err.message}`
      : notificationsQueue.afterExecutionError.message

    dispatch(closeSnackbarAction({ key: beforeExecutionKey }))

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
