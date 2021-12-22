import { TransactionListItem, Transaction, MultisigExecutionInfo } from '@gnosis.pm/safe-react-gateway-sdk'

import { getNotificationsFromTxType } from 'src/logic/notifications'
import { isTransactionSummary, LocalTransactionStatus } from 'src/logic/safe/store/models/types/gateway.d'
import { HistoryPayload } from 'src/logic/safe/store/reducer/gatewayTransactions'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import { SafesMap } from 'src/logic/safe/store/reducer/types/safe'
import { Notification } from 'src/logic/notifications/notificationTypes'

let nonce: number | undefined

export const setNonce = (newNonce: typeof nonce): void => {
  nonce = newNonce
}

export const getNotification = (
  { safeAddress, values }: HistoryPayload,
  userAddress: string,
  safes: SafesMap,
): undefined | Notification => {
  const currentSafe = safes.get(safeAddress)

  // no notification if not in the current safe or not connected
  if (!currentSafe || !userAddress) {
    return
  }

  // if we have a nonce, then we have a tx that is about to be executed
  if (nonce !== undefined) {
    const executedTx = values
      .filter(isTransactionSummary)
      .map((item: TransactionListItem) => (item as Transaction).transaction)
      .find((transaction) => (transaction.executionInfo as MultisigExecutionInfo)?.nonce === nonce)

    // transaction that was pending, was moved into history
    // that is: it was executed
    if (executedTx !== undefined) {
      const notificationsQueue = getNotificationsFromTxType(TX_NOTIFICATION_TYPES.STANDARD_TX)
      const notification =
        executedTx.txStatus === LocalTransactionStatus.FAILED
          ? notificationsQueue.afterExecutionError
          : notificationsQueue.afterExecution.noMoreConfirmationsNeeded

      // reset nonce value
      setNonce(undefined)

      return notification
    }
  }
}
