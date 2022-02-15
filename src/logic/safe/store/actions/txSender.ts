import { TransactionDetails } from '@gnosis.pm/safe-react-gateway-sdk'

import { createTxNotifications } from 'src/logic/notifications'
import {
  getApprovalTransaction,
  getExecutionTransaction,
  isMetamaskRejection,
  proposeTx,
  tryOffChainSigning,
} from 'src/logic/safe/transactions'
import { createSendParams } from 'src/logic/safe/transactions/gas'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
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
import { CreateTransactionArgs } from 'src/logic/safe/store/actions/createTransaction'
import { GnosisSafe } from 'src/types/contracts/gnosis_safe'
import { ProviderState } from 'src/logic/wallets/store/reducer/provider'
import { ProcessTransactionArgs } from './processTransaction'

const navigateToTx = (safeAddress: string, txDetails: TransactionDetails) => {
  if (!isMultiSigExecutionDetails(txDetails.detailedExecutionInfo)) {
    return
  }
  const prefixedSafeAddress = getPrefixedSafeAddressSlug({
    shortName: extractShortChainName(),
    safeAddress,
  })
  const txRoute = generatePath(SAFE_ROUTES.TRANSACTIONS_SINGULAR, {
    [SAFE_ADDRESS_SLUG]: prefixedSafeAddress,
    [TRANSACTION_ID_SLUG]: txDetails.detailedExecutionInfo.safeTxHash,
  })

  history.push(txRoute)
}

type SenderArgs = {
  props: CreateTransactionArgs | ProcessTransactionArgs
  origin: string | null
  dispatch: Dispatch
  isExecuting: boolean
  provider: ProviderState
  safeVersion: string
  txArgs: TxArgs
  safeTxHash: string
  safeInstance: GnosisSafe
  navigateToDeeplink?: boolean
  txId?: string
}

export type ConfirmEventHandler = (safeTxHash: string) => void
export type ErrorEventHandler = () => void

type TxHash = string | undefined

export class TxSender {
  origin: string | null
  dispatch: Dispatch
  isExecuting: boolean
  provider: ProviderState
  safeVersion: string
  txArgs: TxArgs
  safeTxHash: string
  safeInstance: GnosisSafe
  safeAddress: string
  from: string
  ethParameters: (CreateTransactionArgs | ProcessTransactionArgs)['ethParameters']
  notifications: ReturnType<typeof createTxNotifications>

  navigateToDeeplink?: boolean
  txId?: string
  confirmCallback?: ConfirmEventHandler
  errorCallback?: ErrorEventHandler

  constructor(
    {
      props,
      origin,
      dispatch,
      isExecuting,
      provider,
      safeVersion,
      txArgs,
      safeTxHash,
      safeInstance,
      navigateToDeeplink,
      txId,
    }: SenderArgs,
    confirmCallback?: ConfirmEventHandler,
    errorCallback?: ErrorEventHandler,
  ) {
    this.origin = origin
    this.dispatch = dispatch
    this.isExecuting = isExecuting
    this.provider = provider
    this.safeVersion = safeVersion
    this.txArgs = txArgs
    this.safeTxHash = safeTxHash
    this.safeInstance = safeInstance
    this.safeAddress = props.safeAddress
    this.from = provider.account
    this.ethParameters = props.ethParameters
    this.notifications = createTxNotifications(props.notifiedTransaction, origin, dispatch)

    // Can be undefined
    this.navigateToDeeplink = navigateToDeeplink
    this.txId = txId
    this.confirmCallback = confirmCallback
    this.errorCallback = errorCallback
  }

  async submitTx(): Promise<TxHash> {
    const { isExecuting, provider, safeVersion } = this

    const canSignOffChain = checkIfOffChainSignatureIsPossible(isExecuting, provider.smartContractWallet, safeVersion)
    if (!isExecuting && canSignOffChain) {
      this.signOffChain()
      return
    }

    const txHash = this.sendTx()
    return txHash
  }

  private async signOffChain(): Promise<void> {
    const { safeTxHash, txArgs, safeAddress, provider, safeVersion } = this

    try {
      const signature = await tryOffChainSigning(
        safeTxHash,
        { ...txArgs, safeAddress },
        provider.hardwareWallet,
        safeVersion,
      )

      this.onComplete(signature)
    } catch (err) {
      // User likely rejected transaction
      logError(Errors._814, err.message)
    }
  }

  private async sendTx(): Promise<TxHash> {
    const { isExecuting, txArgs, safeInstance, safeTxHash, from, ethParameters } = this

    // Optimise notifications
    if (isExecuting) {
      aboutToExecuteTx.setNonce(txArgs.nonce)
    }

    // On-chain signature or execution
    const tx = isExecuting ? getExecutionTransaction(txArgs) : getApprovalTransaction(safeInstance, safeTxHash)
    const sendParams = createSendParams(from, ethParameters || {})

    let txHash: TxHash
    const promiEvent = tx.send(sendParams)

    try {
      txHash = await new Promise((resolve, reject) => {
        promiEvent.once('transactionHash', resolve) // this happens much faster than receipt
        promiEvent.on('error', reject)
      })

      this.onComplete()
    } catch (err) {
      this.onSendError(err, txHash)
    }

    return txHash
  }

  private async onComplete(signature: string | undefined = undefined): Promise<void> {
    const {
      isExecuting,
      txId,
      txArgs,
      dispatch,
      notifications,
      confirmCallback,
      safeTxHash,
      navigateToDeeplink,
      safeAddress,
    } = this

    // Propose the tx to the backend
    let txDetails: TransactionDetails | null = null
    if (!isExecuting) {
      try {
        txDetails = await proposeTx({ ...txArgs, signature, origin })
      } catch (err) {
        logError(Errors._816, err.message)
        return
      }
    }

    // Set either: already existing transaction or newly proposed, immediately executing tx as pending
    const id = txId || txDetails?.txId
    if (isExecuting && id) {
      dispatch(addPendingTransaction({ id }))
    }

    notifications.closePending()

    // This is used to communicate the safeTxHash to a Safe App caller
    confirmCallback?.(safeTxHash)

    // Go to a tx deep-link
    if (txDetails && navigateToDeeplink) {
      navigateToTx(safeAddress, txDetails)
    }

    dispatch(fetchTransactions(_getChainId(), safeAddress))
  }

  // Error handling logic for on-chain transactions (off-chain errors simply log)
  private async onSendError(err: Error & { code: number }, txHash: TxHash): Promise<void> {
    const { isExecuting, errorCallback, notifications, txId, dispatch, txArgs, safeInstance, from } = this

    logError(isExecuting ? Errors._804 : Errors._803, err.message)

    errorCallback?.()

    notifications.closePending()

    // Existing transaction was being finalised (txId exists)
    if (isExecuting && txId) {
      dispatch(removePendingTransaction({ id: txId }))
    }

    if (!isMetamaskRejection(err)) {
      const { to, valueInWei, data, operation, sigs } = txArgs
      const executedData = txHash
        ? safeInstance.methods.approveHash(txHash).encodeABI()
        : safeInstance.methods
            .execTransaction(to, valueInWei, data, operation, 0, 0, 0, ZERO_ADDRESS, ZERO_ADDRESS, sigs)
            .encodeABI()

      const contractErrorMessage = await fetchOnchainError(executedData, safeInstance, from)

      notifications.showOnError(err, contractErrorMessage)
    }
  }
}
