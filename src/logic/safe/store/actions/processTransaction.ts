import { List } from 'immutable'
import { AnyAction } from 'redux'
import { ThunkAction } from 'redux-thunk'

import { getGnosisSafeInstanceAt } from 'src/logic/contracts/safeContracts'
import { getNotificationsFromTxType, NOTIFICATIONS } from 'src/logic/notifications'
import {
  checkIfOffChainSignatureIsPossible,
  generateSignaturesFromTxConfirmations,
  getPreValidatedSignatures,
} from 'src/logic/safe/safeTxSigner'
import { getApprovalTransaction, getExecutionTransaction, saveTxToHistory } from 'src/logic/safe/transactions'
import { tryOffChainSigning } from 'src/logic/safe/transactions/offchainSigner'
import * as aboutToExecuteTx from 'src/logic/safe/utils/aboutToExecuteTx'
import { currentChainId } from 'src/logic/config/store/selectors'
import { currentSafeCurrentVersion } from 'src/logic/safe/store/selectors'
import { EMPTY_DATA } from 'src/logic/wallets/ethTransactions'
import { providerSelector } from 'src/logic/wallets/store/selectors'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import closeSnackbarAction from 'src/logic/notifications/store/actions/closeSnackbar'
import { fetchSafe } from 'src/logic/safe/store/actions/fetchSafe'
import fetchTransactions from 'src/logic/safe/store/actions/transactions/fetchTransactions'
import { shouldExecuteTransaction } from 'src/logic/safe/store/actions/utils'
import { AppReduxState } from 'src/store'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { Dispatch, DispatchReturn } from './types'
import { PayableTx } from 'src/types/contracts/types'
import { updateTransactionStatus } from 'src/logic/safe/store/actions/updateTransactionStatus'
import { Confirmation } from 'src/logic/safe/store/models/types/confirmation'
import { Operation } from '@gnosis.pm/safe-react-gateway-sdk'
import { Errors, logError } from 'src/logic/exceptions/CodedException'
import { onboardUser } from 'src/components/ConnectButton'
import { getGasParam } from '../../transactions/gas'
import { getLastTransaction } from '../selectors/gatewayTransactions'
import { getRecommendedNonce } from '../../api/fetchSafeTxGasEstimation'
import { LocalTransactionStatus } from '../models/types/gateway.d'
import { isTxPendingError } from 'src/logic/wallets/getWeb3'

interface ProcessTransactionArgs {
  approveAndExecute: boolean
  notifiedTransaction: string
  safeAddress: string
  tx: {
    id: string
    confirmations: List<Confirmation>
    origin: string // json.stringified url, name
    to: string
    value: string
    data: string
    operation: Operation
    nonce: number
    safeTxGas: string
    safeTxHash: string
    baseGas: string
    gasPrice: string
    gasToken: string
    refundReceiver: string
  }
  userAddress: string
  ethParameters?: Pick<TxParameters, 'ethNonce' | 'ethGasLimit' | 'ethGasPriceInGWei'>
  thresholdReached: boolean
}

type ProcessTransactionAction = ThunkAction<Promise<void | string>, AppReduxState, DispatchReturn, AnyAction>

export const processTransaction =
  ({
    approveAndExecute,
    notifiedTransaction,
    safeAddress,
    tx,
    userAddress,
    ethParameters,
    thresholdReached,
  }: ProcessTransactionArgs): ProcessTransactionAction =>
  async (dispatch: Dispatch, getState: () => AppReduxState): Promise<DispatchReturn> => {
    const ready = await onboardUser()
    if (!ready) return

    const state = getState()

    const { account: from, hardwareWallet, smartContractWallet } = providerSelector(state)
    const chainId = currentChainId(state)
    const safeVersion = currentSafeCurrentVersion(state) as string
    const safeInstance = getGnosisSafeInstanceAt(safeAddress, safeVersion)

    const lastTx = getLastTransaction(state)
    let nonce: string
    try {
      nonce = (await getRecommendedNonce(safeAddress)).toString()
    } catch (e) {
      logError(Errors._616, e.message)
      nonce = await safeInstance.methods.nonce().call()
    }
    const isExecution = approveAndExecute || (await shouldExecuteTransaction(safeInstance, nonce, lastTx))

    const preApprovingOwner = approveAndExecute && !thresholdReached ? userAddress : undefined
    let sigs = generateSignaturesFromTxConfirmations(tx.confirmations, preApprovingOwner)

    if (!sigs) {
      sigs = getPreValidatedSignatures(from)
    }

    const notificationsQueue = getNotificationsFromTxType(notifiedTransaction, tx.origin)
    const beforeExecutionKey = dispatch(enqueueSnackbar(notificationsQueue.beforeExecution))

    let txHash
    let transaction
    const txArgs = {
      ...tx, // merge the previous tx with new data
      safeInstance,
      to: tx.to,
      valueInWei: tx.value,
      data: tx.data ?? EMPTY_DATA,
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
      if (checkIfOffChainSignatureIsPossible(isExecution, smartContractWallet, safeVersion)) {
        const signature = await tryOffChainSigning(
          tx.safeTxHash,
          { ...txArgs, safeAddress },
          hardwareWallet,
          safeVersion,
        )

        if (signature) {
          dispatch(closeSnackbarAction({ key: beforeExecutionKey }))

          await saveTxToHistory({ ...txArgs, signature })

          dispatch(fetchTransactions(chainId, safeAddress))
          return
        }
      }

      transaction = isExecution ? getExecutionTransaction(txArgs) : getApprovalTransaction(safeInstance, tx.safeTxHash)

      const sendParams: PayableTx = {
        from,
        value: 0,
        gas: ethParameters?.ethGasLimit,
        [getGasParam()]: ethParameters?.ethGasPriceInGWei,
        nonce: ethParameters?.ethNonce,
      }

      await transaction
        .send(sendParams)
        .once('transactionHash', async (hash: string) => {
          txHash = hash
          dispatch(closeSnackbarAction({ key: beforeExecutionKey }))

          if (isExecution) {
            dispatch(updateTransactionStatus({ safeTxHash: tx.safeTxHash, status: LocalTransactionStatus.PENDING }))
            aboutToExecuteTx.setNonce(txArgs.nonce)
          }

          if (!isExecution) {
            try {
              await saveTxToHistory({ ...txArgs })
            } catch (e) {
              logError(Errors._804, e.message)
            }
          }
        })
        .then(async (receipt) => {
          dispatch(fetchTransactions(chainId, safeAddress))

          if (isExecution) {
            dispatch(fetchSafe(safeAddress))
          }

          return receipt.transactionHash
        })
    } catch (err) {
      logError(Errors._804, err.message)

      dispatch(closeSnackbarAction({ key: beforeExecutionKey }))

      if (isExecution) {
        dispatch(updateTransactionStatus({ safeTxHash: tx.safeTxHash, status: LocalTransactionStatus.PENDING_FAILED }))
      }

      const notification = isTxPendingError(err)
        ? NOTIFICATIONS.TX_PENDING_MSG
        : {
            ...notificationsQueue.afterExecutionError,
            message: `${notificationsQueue.afterExecutionError.message} - ${err.message}`,
          }

      dispatch(enqueueSnackbar({ key: err.code, ...notification }))
    }

    return txHash
  }
