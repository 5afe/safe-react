import { List } from 'immutable'
import { AnyAction } from 'redux'
import { ThunkAction } from 'redux-thunk'

import { getGnosisSafeInstanceAt } from 'src/logic/contracts/safeContracts'
import { getNotificationsFromTxType } from 'src/logic/notifications'
import {
  checkIfOffChainSignatureIsPossible,
  generateSignaturesFromTxConfirmations,
  getPreValidatedSignatures,
} from 'src/logic/safe/safeTxSigner'
import { getApprovalTransaction, getExecutionTransaction, saveTxToHistory } from 'src/logic/safe/transactions'
import { tryOffChainSigning } from 'src/logic/safe/transactions/offchainSigner'
import * as aboutToExecuteTx from 'src/logic/safe/utils/aboutToExecuteTx'
import { getCurrentSafeVersion } from 'src/logic/safe/utils/safeVersion'
import { EMPTY_DATA } from 'src/logic/wallets/ethTransactions'
import { providerSelector } from 'src/logic/wallets/store/selectors'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import closeSnackbarAction from 'src/logic/notifications/store/actions/closeSnackbar'
import { fetchSafe } from 'src/logic/safe/store/actions/fetchSafe'
import fetchTransactions from 'src/logic/safe/store/actions/transactions/fetchTransactions'
import { getLastTx, getNewTxNonce, shouldExecuteTransaction } from 'src/logic/safe/store/actions/utils'
import { AppReduxState } from 'src/store'
import { getErrorMessage } from 'src/test/utils/ethereumErrors'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'

import { Dispatch, DispatchReturn } from './types'
import { PayableTx } from 'src/types/contracts/types'

import { updateTransactionStatus } from 'src/logic/safe/store/actions/updateTransactionStatus'
import { Confirmation } from 'src/logic/safe/store/models/types/confirmation'
import { Operation } from 'src/logic/safe/store/models/types/gateway.d'

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
    safeTxGas: number
    safeTxHash: string
    baseGas: number
    gasPrice: string
    gasToken: string
    refundReceiver: string
  }
  userAddress: string
  ethParameters?: Pick<TxParameters, 'ethNonce' | 'ethGasLimit' | 'ethGasPriceInGWei'>
  thresholdReached: boolean
}

type ProcessTransactionAction = ThunkAction<Promise<void | string>, AppReduxState, DispatchReturn, AnyAction>

export const processTransaction = ({
  approveAndExecute,
  notifiedTransaction,
  safeAddress,
  tx,
  userAddress,
  ethParameters,
  thresholdReached,
}: ProcessTransactionArgs): ProcessTransactionAction => async (
  dispatch: Dispatch,
  getState: () => AppReduxState,
): Promise<DispatchReturn> => {
  const state = getState()

  const { account: from, hardwareWallet, smartContractWallet } = providerSelector(state)
  const safeInstance = getGnosisSafeInstanceAt(safeAddress)

  const lastTx = await getLastTx(safeAddress)
  const nonce = await getNewTxNonce(lastTx, safeInstance)
  const isExecution = approveAndExecute || (await shouldExecuteTransaction(safeInstance, nonce, lastTx))
  const safeVersion = await getCurrentSafeVersion(safeInstance)

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
      const signature = await tryOffChainSigning(tx.safeTxHash, { ...txArgs, safeAddress }, hardwareWallet, safeVersion)

      if (signature) {
        dispatch(closeSnackbarAction({ key: beforeExecutionKey }))

        dispatch(updateTransactionStatus({ txStatus: 'PENDING', safeAddress, nonce: tx.nonce, id: tx.id }))
        await saveTxToHistory({ ...txArgs, signature })

        dispatch(fetchTransactions(safeAddress))
        return
      }
    }

    transaction = isExecution ? getExecutionTransaction(txArgs) : getApprovalTransaction(safeInstance, tx.safeTxHash)

    const sendParams: PayableTx = {
      from,
      value: 0,
      gas: ethParameters?.ethGasLimit,
      gasPrice: ethParameters?.ethGasPriceInGWei,
      nonce: ethParameters?.ethNonce,
    }

    await transaction
      .send(sendParams)
      .once('transactionHash', async (hash: string) => {
        txHash = hash
        dispatch(closeSnackbarAction({ key: beforeExecutionKey }))

        dispatch(
          updateTransactionStatus({
            txStatus: 'PENDING',
            safeAddress,
            nonce: tx.nonce,
            // if we provide the tx ID that sole tx will have the _pending_ status.
            // if not, all the txs that share the same nonce will have the _pending_ status.
            id: tx.id,
          }),
        )

        try {
          await saveTxToHistory({ ...txArgs, txHash })

          // store the pending transaction's nonce
          isExecution && aboutToExecuteTx.setNonce(txArgs.nonce)

          dispatch(fetchTransactions(safeAddress))
        } catch (e) {
          console.error(e)
        }
      })
      .on('error', (error) => {
        dispatch(
          updateTransactionStatus({
            txStatus: 'PENDING_FAILED',
            safeAddress,
            nonce: tx.nonce,
            id: tx.id,
          }),
        )

        console.error('Processing transaction error: ', error)
      })
      .then(async (receipt) => {
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

    dispatch(closeSnackbarAction({ key: beforeExecutionKey }))

    dispatch(
      updateTransactionStatus({
        txStatus: 'PENDING_FAILED',
        safeAddress,
        nonce: tx.nonce,
        id: tx.id,
      }),
    )
    dispatch(enqueueSnackbar({ key: err.code, message: errorMsg, options: { persist: true, variant: 'error' } }))

    if (txHash) {
      const executeData = safeInstance.methods.approveHash(txHash).encodeABI()
      const errMsg = await getErrorMessage(safeInstance.options.address, 0, executeData, from)
      console.error(`Error executing the TX: ${errMsg}`)
    }
  }

  return txHash
}
