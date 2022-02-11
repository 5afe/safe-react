import { TransactionDetails } from '@gnosis.pm/safe-react-gateway-sdk'

import { onboardUser } from 'src/components/ConnectButton'
import { getGnosisSafeInstanceAt } from 'src/logic/contracts/safeContracts'
import { createTxNotifications } from 'src/logic/notifications'
import {
  getApprovalTransaction,
  getExecutionTransaction,
  saveTxToHistory,
  tryOffChainSigning,
} from 'src/logic/safe/transactions'
import { createSendParams } from 'src/logic/safe/transactions/gas'
import { currentSafeCurrentVersion } from 'src/logic/safe/store/selectors'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { providerSelector } from 'src/logic/wallets/store/selectors'
import { getNonce } from 'src/logic/safe/store/actions/utils'
import { AppReduxState } from 'src/store'
import { checkIfOffChainSignatureIsPossible } from 'src/logic/safe/safeTxSigner'
import { Errors, logError } from 'src/logic/exceptions/CodedException'
import { fetchOnchainError } from 'src/logic/contracts/safeContractErrors'
import { removePendingTransaction, addPendingTransaction } from 'src/logic/safe/store/actions/pendingTransactions'
import { _getChainId } from 'src/config'
import * as aboutToExecuteTx from 'src/logic/safe/utils/aboutToExecuteTx'
import { Dispatch } from 'src/logic/safe/store/actions/types'
import { generatePath } from 'react-router-dom'
import {
  getPrefixedSafeAddressSlug,
  extractShortChainName,
  SAFE_ROUTES,
  SAFE_ADDRESS_SLUG,
  TRANSACTION_ID_SLUG,
  history,
} from 'src/routes/routes'
import { isMultiSigExecutionDetails } from 'src/logic/safe/store/models/types/gateway.d'
import { TxArgs } from 'src/logic/safe/store/models/types/transaction'
import fetchTransactions from 'src/logic/safe/store/actions/transactions/fetchTransactions'
import {
  ConfirmEventHandler,
  CreateTransactionArgs,
  ErrorEventHandler,
} from 'src/logic/safe/store/actions/createTransaction'
import { GnosisSafe } from 'src/types/contracts/gnosis_safe'

export const METAMASK_REJECT_CONFIRM_TX_ERROR_CODE = 4001

export type RequiredTxProps = CreateTransactionArgs &
  Required<Pick<CreateTransactionArgs, 'txData' | 'operation' | 'navigateToTransactionsTab' | 'origin'>>

export type TxSender = {
  safeInstance: GnosisSafe
  nonce: string
  safeVersion: string
  from: string
  submitTx: (
    {
      isFinalization,
      txArgs,
      safeTxHash,
    }: {
      isFinalization: boolean
      txArgs: TxArgs
      safeTxHash: string
    },
    confirmCallback?: ConfirmEventHandler | undefined,
    errorCallback?: ErrorEventHandler | undefined,
  ) => Promise<void>
}

const navigateToTx = (safeAddress: string, txDetails: TransactionDetails) => {
  if (!isMultiSigExecutionDetails(txDetails.detailedExecutionInfo)) {
    return
  }
  const prefixedSafeAddress = getPrefixedSafeAddressSlug({ shortName: extractShortChainName(), safeAddress })
  const txRoute = generatePath(SAFE_ROUTES.TRANSACTIONS_SINGULAR, {
    [SAFE_ADDRESS_SLUG]: prefixedSafeAddress,
    [TRANSACTION_ID_SLUG]: txDetails.detailedExecutionInfo.safeTxHash,
  })

  history.push(txRoute)
}

export const getTxSender = async (
  dispatch: Dispatch,
  state: AppReduxState,
  txProps: RequiredTxProps,
  txId: string | undefined = undefined,
): Promise<TxSender> => {
  // Wallet connection
  const hasProvider = await onboardUser()
  if (!hasProvider) {
    throw Error('No wallet connection')
  }

  const notifications = createTxNotifications(txProps.notifiedTransaction, txProps.origin, dispatch)
  const safeVersion = currentSafeCurrentVersion(state)
  const safeInstance = getGnosisSafeInstanceAt(txProps.safeAddress, safeVersion)
  const nonce = txProps.txNonce?.toString() || (await getNonce(txProps.safeAddress, safeVersion))
  const { hardwareWallet, account: from, smartContractWallet } = providerSelector(state)

  const onComplete = async (
    {
      txArgs,
      signature = undefined,
      isFinalization,
      safeTxHash,
      txId,
    }: {
      txArgs: TxArgs
      signature?: string
      isFinalization: boolean
      txId?: string
      safeTxHash: string
    },
    confirmCallback?: ConfirmEventHandler,
  ): Promise<void> => {
    // Propose the tx to the backend
    // 1) If signing
    // 2) If creating a new tx (no txId yet)
    let txDetails: TransactionDetails | null = null
    if (txArgs && (!isFinalization || !txId)) {
      try {
        txDetails = await saveTxToHistory({ ...txArgs, signature, origin })
      } catch (err) {
        logError(Errors._816, err.message)
        return
      }
    }

    // If threshold reached except for last sig, and owner chooses to execute the created tx immediately
    // we retrieve txId of newly created tx from the proposal response
    if (isFinalization && txDetails) {
      dispatch(addPendingTransaction({ id: txDetails.txId }))
    }

    notifications.closePending()

    // This is used to communicate the safeTxHash to a Safe App caller
    confirmCallback?.(safeTxHash)

    // Go to a tx deep-link
    if (txDetails && txProps.navigateToTransactionsTab) {
      navigateToTx(txProps.safeAddress, txDetails)
    }

    dispatch(fetchTransactions(_getChainId(), txProps.safeAddress))
  }

  const submitTx = async (
    txDetails: { isFinalization: boolean; txArgs: TxArgs; safeTxHash: string },
    confirmCallback?: ConfirmEventHandler,
    errorCallback?: ErrorEventHandler,
  ): Promise<void> => {
    const { isFinalization, txArgs, safeTxHash } = txDetails

    const canSignOffChain = checkIfOffChainSignatureIsPossible(isFinalization, smartContractWallet, safeVersion)
    // Off-chain signature
    if (!isFinalization && canSignOffChain) {
      try {
        const signature = await tryOffChainSigning(
          safeTxHash,
          { ...txArgs, sender: String(txArgs.sender), safeAddress: txProps.safeAddress },
          hardwareWallet,
          safeVersion,
        )

        onComplete({ ...txDetails, signature }, confirmCallback)
      } catch (err) {
        // User likely rejected transaction
        logError(Errors._814, err.message)
      }
      return
    }

    const tx = isFinalization ? getExecutionTransaction(txArgs) : getApprovalTransaction(safeInstance, safeTxHash)
    const sendParams = createSendParams(from, txProps.ethParameters || {})
    const promiEvent = tx.send(sendParams)

    // When signing on-chain don't mark as pending as it is never removed
    if (isFinalization) {
      // Finalising existing transaction (txId exists)
      if (txId) {
        dispatch(addPendingTransaction({ id: txId }))
      }
      aboutToExecuteTx.setNonce(txArgs.nonce)
    }

    // On-chain signature or execution
    try {
      new Promise((resolve, reject) => {
        promiEvent.once('transactionHash', resolve) // this happens much faster than receipt
        promiEvent.once('error', reject)
      })

      onComplete({ ...txDetails, txId }, confirmCallback)
    } catch (err) {
      logError(Errors._803, err.message)

      errorCallback?.()

      notifications.closePending()

      // Existing transaction was being finalised (txId exists)
      if (isFinalization && txId) {
        dispatch(removePendingTransaction({ id: txId }))
      }

      const executeDataUsedSignatures = safeInstance.methods
        .execTransaction(
          txProps.to,
          txProps.valueInWei,
          txProps.txData,
          txProps.operation,
          0,
          0,
          0,
          ZERO_ADDRESS,
          ZERO_ADDRESS,
          txArgs.sigs,
        )
        .encodeABI()
      const contractErrorMessage = await fetchOnchainError(executeDataUsedSignatures, safeInstance, from)

      notifications.showOnError(err, contractErrorMessage)
    }
  }

  return {
    safeInstance,
    nonce,
    safeVersion,
    from,
    submitTx,
  }
}
