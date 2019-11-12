// @flow
import * as React from 'react'
import { IconButton } from '@material-ui/core'
import { Close as IconClose } from '@material-ui/icons'
import { TX_NOTIFICATION_TYPES } from '~/logic/safe/transactions'
import { store } from '~/store'
import closeSnackbarAction from '~/logic/notifications/store/actions/closeSnackbar'
import { type Notification, NOTIFICATIONS } from './notificationTypes'

export type NotificationsQueue = {
  beforeExecution: Notification | null,
  pendingExecution: Notification | null,
  afterExecution: {
    noMoreConfirmationsNeeded: Notification | null,
    moreConfirmationsNeeded: Notification | null,
  },
  afterExecutionError: Notification | null,
  afterRejection: Notification | null,
}

const standardTxNotificationsQueue: NotificationsQueue = {
  beforeExecution: NOTIFICATIONS.SIGN_TX_MSG,
  pendingExecution: NOTIFICATIONS.TX_PENDING_MSG,
  afterRejection: NOTIFICATIONS.TX_REJECTED_MSG,
  afterExecution: {
    noMoreConfirmationsNeeded: NOTIFICATIONS.TX_EXECUTED_MSG,
    moreConfirmationsNeeded: NOTIFICATIONS.TX_EXECUTED_MORE_CONFIRMATIONS_MSG,
  },
  afterExecutionError: NOTIFICATIONS.TX_FAILED_MSG,
}

const confirmationTxNotificationsQueue: NotificationsQueue = {
  beforeExecution: NOTIFICATIONS.SIGN_TX_MSG,
  pendingExecution: NOTIFICATIONS.TX_CONFIRMATION_PENDING_MSG,
  afterRejection: NOTIFICATIONS.TX_REJECTED_MSG,
  afterExecution: {
    noMoreConfirmationsNeeded: NOTIFICATIONS.TX_CONFIRMATION_EXECUTED_MSG,
    moreConfirmationsNeeded: null,
  },
  afterExecutionError: NOTIFICATIONS.TX_CONFIRMATION_FAILED_MSG,
}

const cancellationTxNotificationsQueue: NotificationsQueue = {
  beforeExecution: NOTIFICATIONS.SIGN_TX_MSG,
  pendingExecution: NOTIFICATIONS.TX_PENDING_MSG,
  afterRejection: NOTIFICATIONS.TX_REJECTED_MSG,
  afterExecution: {
    noMoreConfirmationsNeeded: NOTIFICATIONS.TX_EXECUTED_MSG,
    moreConfirmationsNeeded: NOTIFICATIONS.TX_EXECUTED_MORE_CONFIRMATIONS_MSG,
  },
  afterExecutionError: NOTIFICATIONS.TX_FAILED_MSG,
}

const safeNameChangeNotificationsQueue: NotificationsQueue = {
  beforeExecution: null,
  pendingExecution: null,
  afterRejection: null,
  afterExecution: {
    noMoreConfirmationsNeeded: NOTIFICATIONS.SAFE_NAME_CHANGED_MSG,
    moreConfirmationsNeeded: null,
  },
  afterExecutionError: null,
}

const ownerNameChangeNotificationsQueue: NotificationsQueue = {
  beforeExecution: null,
  pendingExecution: null,
  afterRejection: null,
  afterExecution: {
    noMoreConfirmationsNeeded: NOTIFICATIONS.OWNER_NAME_CHANGE_EXECUTED_MSG,
    moreConfirmationsNeeded: null,
  },
  afterExecutionError: null,
}

const settingsChangeTxNotificationsQueue: NotificationsQueue = {
  beforeExecution: NOTIFICATIONS.SIGN_SETTINGS_CHANGE_MSG,
  pendingExecution: NOTIFICATIONS.SETTINGS_CHANGE_PENDING_MSG,
  afterRejection: NOTIFICATIONS.SETTINGS_CHANGE_REJECTED_MSG,
  afterExecution: {
    noMoreConfirmationsNeeded: NOTIFICATIONS.SETTINGS_CHANGE_EXECUTED_MSG,
    moreConfirmationsNeeded: NOTIFICATIONS.SETTINGS_CHANGE_EXECUTED_MORE_CONFIRMATIONS_MSG,
  },
  afterExecutionError: NOTIFICATIONS.SETTINGS_CHANGE_FAILED_MSG,
}

const defaultNotificationsQueue: NotificationsQueue = {
  beforeExecution: NOTIFICATIONS.SIGN_TX_MSG,
  pendingExecution: NOTIFICATIONS.TX_PENDING_MSG,
  afterRejection: NOTIFICATIONS.TX_REJECTED_MSG,
  afterExecution: {
    noMoreConfirmationsNeeded: NOTIFICATIONS.TX_EXECUTED_MSG,
    moreConfirmationsNeeded: NOTIFICATIONS.TX_EXECUTED_MORE_CONFIRMATIONS_MSG,
  },
  afterExecutionError: NOTIFICATIONS.TX_FAILED_MSG,
}

export const getNotificationsFromTxType = (txType: string) => {
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
    case TX_NOTIFICATION_TYPES.SETTINGS_CHANGE_TX: {
      notificationsQueue = settingsChangeTxNotificationsQueue
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
    default: {
      notificationsQueue = defaultNotificationsQueue
      break
    }
  }

  return notificationsQueue
}

export const enhanceSnackbarForAction = (notification: Notification) => ({
  ...notification,
  options: {
    ...notification.options,
    action: (key: number) => (
      <IconButton onClick={() => store.dispatch(closeSnackbarAction({ key }))}>
        <IconClose />
      </IconButton>
    ),
  },
})

export const showSnackbar = (notification: Notification, enqueueSnackbar: Function, closeSnackbar: Function) => enqueueSnackbar(notification.message, {
  ...notification.options,
  action: (key) => (
    <IconButton onClick={() => closeSnackbar(key)}>
      <IconClose />
    </IconButton>
  ),
})
