import { TransactionDetails } from '@gnosis.pm/safe-react-gateway-sdk'

import { onboardUser } from 'src/components/ConnectButton'
import { getGnosisSafeInstanceAt } from 'src/logic/contracts/safeContracts'
import { createTxNotifications } from 'src/logic/notifications'
import {
  getApprovalTransaction,
  getExecutionTransaction,
  isMetamaskRejection,
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

export type RequiredTxProps = CreateTransactionArgs &
  Required<Pick<CreateTransactionArgs, 'txData' | 'operation' | 'navigateToTransactionsTab' | 'origin'>>

type SubmitTxProps = {
  isFinalization: boolean
  txArgs: TxArgs
  safeTxHash: string
}

type TxHash = string | undefined

export type TxSender = {
  safeInstance: GnosisSafe
  nonce: string
  safeVersion: string
  from: string
  submitTx: (
    { isFinalization, txArgs, safeTxHash }: SubmitTxProps,
    confirmCallback?: ConfirmEventHandler,
    errorCallback?: ErrorEventHandler,
  ) => Promise<TxHash>
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
  {
    notifiedTransaction,
    origin,
    txNonce,
    safeAddress,
    navigateToTransactionsTab,
    ethParameters,
    to,
    valueInWei,
    txData,
    operation,
  }: RequiredTxProps,
  txId: string | undefined = undefined,
): Promise<TxSender> => {
  // Wallet connection
  const hasProvider = await onboardUser()
  if (!hasProvider) {
    throw Error('No wallet connection')
  }

  const notifications = createTxNotifications(notifiedTransaction, origin, dispatch)
  const safeVersion = currentSafeCurrentVersion(state)
  const safeInstance = getGnosisSafeInstanceAt(safeAddress, safeVersion)
  const nonce = txNonce?.toString() || (await getNonce(safeAddress, safeInstance))
  const { hardwareWallet, account: from, smartContractWallet } = providerSelector(state)

  const submitTx = async (
    { isFinalization, txArgs, safeTxHash }: SubmitTxProps,
    confirmCallback?: ConfirmEventHandler,
    errorCallback?: ErrorEventHandler,
  ): Promise<TxHash> => {
    const onComplete = async (
      signature: string | undefined = undefined,
      confirmCallback?: ConfirmEventHandler,
    ): Promise<void> => {
      // Propose the tx to the backend
      // 1) If signing
      // 2) If creating a new tx (no txId yet)
      let txDetails: TransactionDetails | null = null
      if (!isFinalization || !txId) {
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
      if (txDetails && navigateToTransactionsTab) {
        navigateToTx(safeAddress, txDetails)
      }

      dispatch(fetchTransactions(_getChainId(), safeAddress))
    }

    const canSignOffChain = checkIfOffChainSignatureIsPossible(isFinalization, smartContractWallet, safeVersion)
    // Off-chain signature
    if (!isFinalization && canSignOffChain) {
      try {
        const signature = await tryOffChainSigning(safeTxHash, { ...txArgs, safeAddress }, hardwareWallet, safeVersion)

        onComplete(signature, confirmCallback)
      } catch (err) {
        // User likely rejected transaction
        logError(Errors._814, err.message)
      }
      return
    }

    // When signing on-chain don't mark as pending as it is never removed
    if (isFinalization) {
      // Finalising existing transaction (txId exists)
      if (txId) {
        dispatch(addPendingTransaction({ id: txId }))
      }
      aboutToExecuteTx.setNonce(txArgs.nonce)
    }

    const tx = isFinalization ? getExecutionTransaction(txArgs) : getApprovalTransaction(safeInstance, safeTxHash)
    const sendParams = createSendParams(from, ethParameters || {})

    let txHash: TxHash

    // On-chain signature or execution
    try {
      await tx
        .send(sendParams)
        .once('transactionHash', (hash) => {
          txHash = hash
        })
        .on('error', (err) => {
          throw err
        })
        .then(({ transactionHash }) => transactionHash)

      onComplete(undefined, confirmCallback)
    } catch (err) {
      logError(isFinalization ? Errors._804 : Errors._803, err.message)

      errorCallback?.()

      notifications.closePending()

      // Existing transaction was being finalised (txId exists)
      if (isFinalization && txId) {
        dispatch(removePendingTransaction({ id: txId }))
      }

      if (!isMetamaskRejection(err)) {
        const executedData = txHash
          ? safeInstance.methods.approveHash(txHash).encodeABI()
          : safeInstance.methods
              .execTransaction(to, valueInWei, txData, operation, 0, 0, 0, ZERO_ADDRESS, ZERO_ADDRESS, txArgs.sigs)
              .encodeABI()

        const contractErrorMessage = await fetchOnchainError(executedData, safeInstance, from)

        notifications.showOnError(err, contractErrorMessage)
      }
    }

    return txHash
  }

  return {
    safeInstance,
    nonce,
    safeVersion,
    from,
    submitTx,
  }
}
