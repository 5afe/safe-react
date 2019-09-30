// @flow
import * as React from 'react'
import { IconButton } from '@material-ui/core'
import { Close as IconClose } from '@material-ui/icons'
import { TX_NOTIFICATION_TYPES } from '~/logic/safe/transactions'
import { type Notification, NOTIFICATIONS } from './notificationTypes'

type NotificationsQueue = {
  beforeExecution: Notification,
  pendingExecution: {
    noMoreConfirmationsNeeded: Notification,
    moreConfirmationsNeeded: Notification,
  },
  afterExecution: Notification,
  afterExecutionError: Notification,
  afterRejection: Notification,
}

const standardTxNotificationsQueue: NotificationsQueue = {
  beforeExecution: NOTIFICATIONS.SIGN_TX_MSG,
  pendingExecution: {
    noMoreConfirmationsNeeded: NOTIFICATIONS.TX_PENDING_MSG,
    moreConfirmationsNeeded: NOTIFICATIONS.TX_PENDING_MORE_CONFIRMATIONS_MSG,
  },
  afterRejection: NOTIFICATIONS.TX_REJECTED_MSG,
  afterExecution: NOTIFICATIONS.TX_EXECUTED_MSG,
  afterExecutionError: NOTIFICATIONS.TX_FAILED_MSG,
}

const confirmationTxNotificationsQueue: NotificationsQueue = {
  beforeExecution: NOTIFICATIONS.SIGN_TX_MSG,
  pendingExecution: {
    noMoreConfirmationsNeeded: NOTIFICATIONS.TX_CONFIRMATION_PENDING_MSG,
    moreConfirmationsNeeded: null,
  },
  afterRejection: NOTIFICATIONS.TX_REJECTED_MSG,
  afterExecution: NOTIFICATIONS.TX_CONFIRMATION_EXECUTED_MSG,
  afterExecutionError: NOTIFICATIONS.TX_CONFIRMATION_FAILED_MSG,
}

const cancellationTxNotificationsQueue: NotificationsQueue = {
  beforeExecution: NOTIFICATIONS.SIGN_TX_MSG,
  pendingExecution: {
    noMoreConfirmationsNeeded: NOTIFICATIONS.TX_PENDING_MSG,
    moreConfirmationsNeeded: NOTIFICATIONS.TX_PENDING_MORE_CONFIRMATIONS_MSG,
  },
  afterRejection: NOTIFICATIONS.TX_REJECTED_MSG,
  afterExecution: NOTIFICATIONS.TX_EXECUTED_MSG,
  afterExecutionError: NOTIFICATIONS.TX_FAILED_MSG,
}

const ownerChangeTxNotificationsQueue: NotificationsQueue = {
  beforeExecution: NOTIFICATIONS.SIGN_OWNER_CHANGE_MSG,
  pendingExecution: {
    noMoreConfirmationsNeeded: NOTIFICATIONS.ONWER_CHANGE_PENDING_MSG,
    moreConfirmationsNeeded: NOTIFICATIONS.ONWER_CHANGE_PENDING_MORE_CONFIRMATIONS_MSG,
  },
  afterRejection: NOTIFICATIONS.ONWER_CHANGE_REJECTED_MSG,
  afterExecution: NOTIFICATIONS.OWNER_CHANGE_EXECUTED_MSG,
  afterExecutionError: NOTIFICATIONS.ONWER_CHANGE_FAILED_MSG,
}

const safeNameChangeNotificationsQueue: NotificationsQueue = {
  beforeExecution: null,
  pendingExecution: {
    noMoreConfirmationsNeeded: null,
    moreConfirmationsNeeded: null,
  },
  afterRejection: null,
  afterExecution: NOTIFICATIONS.SAFE_NAME_CHANGE_EXECUTED_MSG,
  afterExecutionError: null,
}

const ownerNameChangeNotificationsQueue: NotificationsQueue = {
  beforeExecution: null,
  pendingExecution: {
    noMoreConfirmationsNeeded: null,
    moreConfirmationsNeeded: null,
  },
  afterRejection: null,
  afterExecution: NOTIFICATIONS.OWNER_NAME_CHANGE_EXECUTED_MSG,
  afterExecutionError: null,
}

const thresholdChangeTxNotificationsQueue: NotificationsQueue = {
  beforeExecution: NOTIFICATIONS.SIGN_THRESHOLD_CHANGE_MSG,
  pendingExecution: {
    noMoreConfirmationsNeeded: NOTIFICATIONS.THRESHOLD_CHANGE_PENDING_MSG,
    moreConfirmationsNeeded: NOTIFICATIONS.THRESHOLD_CHANGE_PENDING_MORE_CONFIRMATIONS_MSG,
  },
  afterRejection: NOTIFICATIONS.THRESHOLD_CHANGE_REJECTED_MSG,
  afterExecution: NOTIFICATIONS.THRESHOLD_CHANGE_EXECUTED_MSG,
  afterExecutionError: NOTIFICATIONS.THRESHOLD_CHANGE_FAILED_MSG,
}

const defaultNotificationsQueue: NotificationsQueue = {
  beforeExecution: NOTIFICATIONS.SIGN_TX_MSG,
  pendingExecution: {
    noMoreConfirmationsNeeded: NOTIFICATIONS.TX_PENDING_MSG,
    moreConfirmationsNeeded: NOTIFICATIONS.TX_PENDING_MORE_CONFIRMATIONS_MSG,
  },
  afterRejection: NOTIFICATIONS.TX_REJECTED_MSG,
  afterExecution: NOTIFICATIONS.TX_EXECUTED_MSG,
  afterExecutionError: NOTIFICATIONS.TX_FAILED_MSG,
}

export const getNofiticationsFromTxType = (txType: string) => {
  let notificationsQueue: NotificationsQueue

  switch (txType) {
    case TX_NOTIFICATION_TYPES.STANDARD_TX: {
      notificationsQueue = standardTxNotificationsQueue
      break
    }
    case TX_NOTIFICATION_TYPES.CONFIRMATION_TX: {
      notificationsQueue = confirmationTxNotificationsQueue
      break
    }
    case TX_NOTIFICATION_TYPES.CANCELLATION_TX: {
      notificationsQueue = cancellationTxNotificationsQueue
      break
    }
    case TX_NOTIFICATION_TYPES.OWNER_CHANGE_TX: {
      notificationsQueue = ownerChangeTxNotificationsQueue
      break
    }
    case TX_NOTIFICATION_TYPES.SAFE_NAME_CHANGE_TX: {
      notificationsQueue = safeNameChangeNotificationsQueue
      break
    }
    case TX_NOTIFICATION_TYPES.OWNER_NAME_CHANGE_TX: {
      notificationsQueue = ownerNameChangeNotificationsQueue
      break
    }
    case TX_NOTIFICATION_TYPES.THRESHOLD_CHANGE_TX: {
      notificationsQueue = thresholdChangeTxNotificationsQueue
      break
    }
    default: {
      notificationsQueue = defaultNotificationsQueue
      break
    }
  }

  return notificationsQueue
}

export const showSnackbar = (
  notification: Notification,
  enqueueSnackbar: Function,
  closeSnackbar: Function,
) => enqueueSnackbar(notification.message, {
  ...notification.options,
  action: (key) => (
    <IconButton onClick={() => closeSnackbar(key)}>
      <IconClose />
    </IconButton>
  ),
})
