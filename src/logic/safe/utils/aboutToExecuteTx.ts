import { getNotificationsFromTxType } from 'src/logic/notifications'
import {
  isStatusFailed,
  isStatusPending,
  isTransactionSummary,
  TransactionGatewayResult,
  TransactionSummary,
} from 'src/logic/safe/store/models/types/gateway.d'
import { HistoryPayload } from 'src/logic/safe/store/reducer/gatewayTransactions'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import { isUserAnOwner } from 'src/logic/wallets/ethAddresses'
import { SafesMap } from 'src/routes/safe/store/reducer/types/safe'

type AboutToExecuteTx = {
  nonce: number | undefined
  setNonce: (nonce: AboutToExecuteTx['nonce']) => void
  getNotification: (payload: HistoryPayload, userAddress: string, safes: SafesMap) => undefined
  identifyPendingTx: (transactions: TransactionSummary[]) => void
}

export const aboutToExecuteTx: AboutToExecuteTx = {
  nonce: undefined,
  setNonce(nonce) {
    this.nonce = nonce
  },
  getNotification({ safeAddress, values }, userAddress, safes) {
    const currentSafe = safes.get(safeAddress)

    // no notification if not in the current safe or if its not an owner
    if (!currentSafe || !isUserAnOwner(currentSafe, userAddress)) {
      return
    }

    // if we have a nonce, then we have a tx that is about to be executed
    if (this.nonce !== undefined) {
      const executedTx = values
        .filter(isTransactionSummary)
        .map((item: TransactionGatewayResult) => item.transaction)
        .find((transaction) => transaction.executionInfo?.nonce === this.nonce)

      // transaction that was pending, was moved into history
      // that is: it was executed
      if (executedTx !== undefined) {
        const notificationsQueue = getNotificationsFromTxType(TX_NOTIFICATION_TYPES.STANDARD_TX)
        const notification = isStatusFailed(executedTx.txStatus)
          ? notificationsQueue.afterExecutionError
          : notificationsQueue.afterExecution.noMoreConfirmationsNeeded

        // reset nonce value
        this.setNonce(undefined)

        return notification
      }
    }
  },
  identifyPendingTx(transactions) {
    if (this.nonce !== undefined) {
      const txByNonce = transactions.find((tx) => tx.executionInfo?.nonce === this.nonce)

      // if for any reason tx remains in the queued list, we cleanup the nonce value
      if (!txByNonce || !isStatusPending(txByNonce.txStatus)) {
        this.setNonce(undefined)
        return
      }

      // we do nothing, as we're waiting for the pending tx resolution
      return
    }

    const nonce = transactions.find((tx) => isStatusPending(tx.txStatus))?.executionInfo?.nonce

    // found a pending tx, then we set the nonce for future tracking
    if (nonce !== undefined) {
      this.setNonce(nonce)
    }
  },
}
