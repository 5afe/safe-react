import { Notification, NOTIFICATIONS } from './notificationTypes'
import { Dispatch } from 'src/logic/safe/store/actions/types'
import { closeNotification, showNotification } from './store/notifications'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import { getAppInfoFromOrigin } from 'src/routes/safe/components/Apps/utils'
import { isTxPendingError } from '../wallets/getWeb3'

const setNotificationOrigin = (notification: Notification, origin?: string): Notification => {
  if (!origin) {
    return notification
  }

  const appInfo = getAppInfoFromOrigin(origin)
  return { ...notification, message: `${appInfo ? appInfo.name : 'Unknown origin'}: ${notification.message}` }
}

type TxNotificationQueue = {
  beforeExecution: Notification
  afterRejection: Notification
  afterExecution: {
    noMoreConfirmationsNeeded: Notification
    moreConfirmationsNeeded?: Notification
  }
  afterExecutionError: Notification
}

const getStandardTxNotificationsQueue = (origin?: string): TxNotificationQueue => ({
  beforeExecution: setNotificationOrigin(NOTIFICATIONS.SIGN_TX_MSG, origin),
  afterRejection: setNotificationOrigin(NOTIFICATIONS.TX_REJECTED_MSG, origin),
  afterExecution: {
    noMoreConfirmationsNeeded: setNotificationOrigin(NOTIFICATIONS.TX_EXECUTED_MSG, origin),
  },
  afterExecutionError: setNotificationOrigin(NOTIFICATIONS.TX_FAILED_MSG, origin),
})

const getConfirmationTxNotificationsQueue = (origin?: string): TxNotificationQueue => {
  return {
    beforeExecution: setNotificationOrigin(NOTIFICATIONS.SIGN_TX_MSG, origin),
    afterRejection: setNotificationOrigin(NOTIFICATIONS.TX_REJECTED_MSG, origin),
    afterExecution: {
      noMoreConfirmationsNeeded: setNotificationOrigin(NOTIFICATIONS.TX_EXECUTED_MSG, origin),
      moreConfirmationsNeeded: setNotificationOrigin(NOTIFICATIONS.TX_CONFIRMATION_EXECUTED_MSG, origin),
    },
    afterExecutionError: setNotificationOrigin(NOTIFICATIONS.TX_CONFIRMATION_FAILED_MSG, origin),
  }
}

const getCancellationTxNotificationsQueue = (origin?: string): TxNotificationQueue => {
  return {
    beforeExecution: setNotificationOrigin(NOTIFICATIONS.SIGN_TX_MSG, origin),
    afterRejection: setNotificationOrigin(NOTIFICATIONS.TX_REJECTED_MSG, origin),
    afterExecution: {
      noMoreConfirmationsNeeded: setNotificationOrigin(NOTIFICATIONS.TX_EXECUTED_MSG, origin),
      moreConfirmationsNeeded: setNotificationOrigin(NOTIFICATIONS.TX_CANCELLATION_EXECUTED_MSG, origin),
    },
    afterExecutionError: setNotificationOrigin(NOTIFICATIONS.TX_FAILED_MSG, origin),
  }
}

const settingsChangeTxNotificationsQueue: TxNotificationQueue = {
  beforeExecution: NOTIFICATIONS.SIGN_SETTINGS_CHANGE_MSG,
  afterRejection: NOTIFICATIONS.SETTINGS_CHANGE_REJECTED_MSG,
  afterExecution: {
    noMoreConfirmationsNeeded: NOTIFICATIONS.SETTINGS_CHANGE_EXECUTED_MSG,
    moreConfirmationsNeeded: NOTIFICATIONS.SETTINGS_CHANGE_EXECUTED_MORE_CONFIRMATIONS_MSG,
  },
  afterExecutionError: NOTIFICATIONS.SETTINGS_CHANGE_FAILED_MSG,
}

const newSpendingLimitTxNotificationsQueue: TxNotificationQueue = {
  beforeExecution: NOTIFICATIONS.SIGN_NEW_SPENDING_LIMIT_MSG,
  afterRejection: NOTIFICATIONS.NEW_SPENDING_LIMIT_REJECTED_MSG,
  afterExecution: {
    noMoreConfirmationsNeeded: NOTIFICATIONS.NEW_SPENDING_LIMIT_EXECUTED_MSG,
    moreConfirmationsNeeded: NOTIFICATIONS.NEW_SPENDING_LIMIT_EXECUTED_MORE_CONFIRMATIONS_MSG,
  },
  afterExecutionError: NOTIFICATIONS.NEW_SPENDING_LIMIT_FAILED_MSG,
}

const spendingLimitTxNotificationsQueue: TxNotificationQueue = {
  beforeExecution: NOTIFICATIONS.SIGN_TX_MSG,
  afterRejection: NOTIFICATIONS.TX_REJECTED_MSG,
  afterExecution: {
    noMoreConfirmationsNeeded: NOTIFICATIONS.SPENDING_LIMIT_EXECUTED_MSG,
  },
  afterExecutionError: NOTIFICATIONS.TX_FAILED_MSG,
}

const removeSpendingLimitTxNotificationsQueue: TxNotificationQueue = {
  beforeExecution: NOTIFICATIONS.SIGN_REMOVE_SPENDING_LIMIT_MSG,
  afterRejection: NOTIFICATIONS.REMOVE_SPENDING_LIMIT_REJECTED_MSG,
  afterExecution: {
    noMoreConfirmationsNeeded: NOTIFICATIONS.REMOVE_SPENDING_LIMIT_EXECUTED_MSG,
    moreConfirmationsNeeded: NOTIFICATIONS.REMOVE_SPENDING_LIMIT_EXECUTED_MORE_CONFIRMATIONS_MSG,
  },
  afterExecutionError: NOTIFICATIONS.REMOVE_SPENDING_LIMIT_FAILED_MSG,
}

const defaultNotificationsQueue: TxNotificationQueue = {
  beforeExecution: NOTIFICATIONS.SIGN_TX_MSG,
  afterRejection: NOTIFICATIONS.TX_REJECTED_MSG,
  afterExecution: {
    noMoreConfirmationsNeeded: NOTIFICATIONS.TX_EXECUTED_MSG,
  },
  afterExecutionError: NOTIFICATIONS.TX_FAILED_MSG,
}

export const getNotificationsFromTxType = (txType: TX_NOTIFICATION_TYPES, origin?: string): TxNotificationQueue => {
  let notificationsQueue: TxNotificationQueue

  switch (txType) {
    case TX_NOTIFICATION_TYPES.STANDARD_TX: {
      notificationsQueue = getStandardTxNotificationsQueue(origin)
      break
    }
    case TX_NOTIFICATION_TYPES.CONFIRMATION_TX: {
      notificationsQueue = getConfirmationTxNotificationsQueue(origin)
      break
    }
    case TX_NOTIFICATION_TYPES.CANCELLATION_TX: {
      notificationsQueue = getCancellationTxNotificationsQueue(origin)
      break
    }
    case TX_NOTIFICATION_TYPES.SETTINGS_CHANGE_TX: {
      notificationsQueue = settingsChangeTxNotificationsQueue
      break
    }
    case TX_NOTIFICATION_TYPES.NEW_SPENDING_LIMIT_TX: {
      notificationsQueue = newSpendingLimitTxNotificationsQueue
      break
    }
    case TX_NOTIFICATION_TYPES.SPENDING_LIMIT_TX: {
      notificationsQueue = spendingLimitTxNotificationsQueue
      break
    }
    case TX_NOTIFICATION_TYPES.REMOVE_SPENDING_LIMIT_TX: {
      notificationsQueue = removeSpendingLimitTxNotificationsQueue
      break
    }
    default: {
      notificationsQueue = defaultNotificationsQueue
      break
    }
  }

  return notificationsQueue
}

export const createTxNotifications = (
  dispatch: Dispatch,
  notifiedTransaction: TX_NOTIFICATION_TYPES,
  origin?: string,
): {
  closePending: () => void
  showOnError: (err: Error & { code: number }, contractErrorMessage?: string) => void
  showOnRejection: (err: Error & { code: number }, contractErrorMessage?: string) => void
} => {
  // Notifications
  // Each tx gets a slot in the global snackbar queue
  // When multiple snackbars are shown, it will re-use the same slot for
  // notifications about different states of the tx
  const txNotifications = getNotificationsFromTxType(notifiedTransaction, origin)
  const beforeExecutionKey = dispatch(showNotification(txNotifications.beforeExecution))

  return {
    closePending: () => dispatch(closeNotification({ key: beforeExecutionKey, read: false })),
    showOnRejection: () => dispatch(showNotification(txNotifications.afterRejection)),
    showOnError: (err: Error & { code: number }, customErrorMessage?: string) => {
      const msg = isTxPendingError(err)
        ? NOTIFICATIONS.TX_PENDING_MSG
        : {
            ...txNotifications.afterExecutionError,
            ...(customErrorMessage && {
              message: `${txNotifications.afterExecutionError.message} - ${customErrorMessage}`,
            }),
          }

      dispatch(showNotification(msg))
    },
  }
}
