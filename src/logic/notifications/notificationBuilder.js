// @flow
import { IconButton } from '@material-ui/core'
import { Close as IconClose } from '@material-ui/icons'
import * as React from 'react'

import { NOTIFICATIONS, type Notification } from './notificationTypes'

import closeSnackbarAction from '~/logic/notifications/store/actions/closeSnackbar'
import { TX_NOTIFICATION_TYPES } from '~/logic/safe/transactions'
import { getAppInfo } from '~/routes/safe/components/Apps/appsList'
import { store } from '~/store'

export type NotificationsQueue = {
  beforeExecution: Notification | null,
  pendingExecution: Notification | null,
  waitingConfirmation?: Notification | null,
  afterExecution: {
    noMoreConfirmationsNeeded: Notification | null,
    moreConfirmationsNeeded: Notification | null,
  } | null,
  afterExecutionError: Notification | null,
  afterRejection: Notification | null,
}

const customizeNotification = (notification: Notification, origin: string): Notification => {
  if (!origin) {
    return notification
  }

  const appInfo = getAppInfo(origin)
  return { ...notification, message: `${appInfo.name}: ${notification.message}` }
}

const getStandardTxNotificationsQueue = (origin?: string): NotificationsQueue => {
  return {
    beforeExecution: customizeNotification(NOTIFICATIONS.SIGN_TX_MSG, origin),
    pendingExecution: customizeNotification(NOTIFICATIONS.TX_PENDING_MSG, origin),
    afterRejection: customizeNotification(NOTIFICATIONS.TX_REJECTED_MSG, origin),
    afterExecution: {
      noMoreConfirmationsNeeded: customizeNotification(NOTIFICATIONS.TX_EXECUTED_MSG, origin),
      moreConfirmationsNeeded: customizeNotification(NOTIFICATIONS.TX_EXECUTED_MORE_CONFIRMATIONS_MSG, origin),
    },
    afterExecutionError: customizeNotification(NOTIFICATIONS.TX_FAILED_MSG, origin),
  }
}

const waitingTransactionNotificationsQueue: NotificationsQueue = {
  beforeExecution: null,
  pendingExecution: null,
  afterRejection: null,
  waitingConfirmation: NOTIFICATIONS.TX_WAITING_MSG,
  afterExecution: null,
  afterExecutionError: null,
}

const getConfirmationTxNotificationsQueue = (origin?: string): NotificationsQueue => {
  return {
    beforeExecution: customizeNotification(NOTIFICATIONS.SIGN_TX_MSG, origin),
    pendingExecution: customizeNotification(NOTIFICATIONS.TX_CONFIRMATION_PENDING_MSG, origin),
    afterRejection: customizeNotification(NOTIFICATIONS.TX_REJECTED_MSG, origin),
    afterExecution: {
      noMoreConfirmationsNeeded: customizeNotification(NOTIFICATIONS.TX_EXECUTED_MSG, origin),
      moreConfirmationsNeeded: customizeNotification(NOTIFICATIONS.TX_CONFIRMATION_EXECUTED_MSG, origin),
    },
    afterExecutionError: customizeNotification(NOTIFICATIONS.TX_CONFIRMATION_FAILED_MSG, origin),
  }
}

const getTancellationTxNotificationsQueue = (origin?: string): NotificationsQueue => {
  return {
    beforeExecution: customizeNotification(NOTIFICATIONS.SIGN_TX_MSG, origin),
    pendingExecution: customizeNotification(NOTIFICATIONS.TX_PENDING_MSG, origin),
    afterRejection: customizeNotification(NOTIFICATIONS.TX_REJECTED_MSG, origin),
    afterExecution: {
      noMoreConfirmationsNeeded: customizeNotification(NOTIFICATIONS.TX_EXECUTED_MSG, origin),
      moreConfirmationsNeeded: customizeNotification(NOTIFICATIONS.TX_CANCELLATION_EXECUTED_MSG, origin),
    },
    afterExecutionError: customizeNotification(NOTIFICATIONS.TX_FAILED_MSG, origin),
  }
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

const addressBookNewEntry: NotificationsQueue = {
  beforeExecution: null,
  pendingExecution: null,
  afterRejection: null,
  waitingConfirmation: null,
  afterExecution: {
    noMoreConfirmationsNeeded: NOTIFICATIONS.ADDRESS_BOOK_NEW_ENTRY_SUCCESS,
    moreConfirmationsNeeded: null,
  },
  afterExecutionError: null,
}

const addressBookEditEntry: NotificationsQueue = {
  beforeExecution: null,
  pendingExecution: null,
  afterRejection: null,
  waitingConfirmation: null,
  afterExecution: {
    noMoreConfirmationsNeeded: NOTIFICATIONS.ADDRESS_BOOK_EDIT_ENTRY_SUCCESS,
    moreConfirmationsNeeded: null,
  },
  afterExecutionError: null,
}

const addressBookDeleteEntry: NotificationsQueue = {
  beforeExecution: null,
  pendingExecution: null,
  afterRejection: null,
  waitingConfirmation: null,
  afterExecution: {
    noMoreConfirmationsNeeded: NOTIFICATIONS.ADDRESS_BOOK_DELETE_ENTRY_SUCCESS,
    moreConfirmationsNeeded: null,
  },
  afterExecutionError: null,
}

export const getNotificationsFromTxType = (txType: string, origin?: string) => {
  let notificationsQueue: NotificationsQueue

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
      notificationsQueue = getTancellationTxNotificationsQueue(origin)
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
    case TX_NOTIFICATION_TYPES.WAITING_TX: {
      notificationsQueue = waitingTransactionNotificationsQueue
      break
    }
    case TX_NOTIFICATION_TYPES.ADDRESSBOOK_NEW_ENTRY: {
      notificationsQueue = addressBookNewEntry
      break
    }
    case TX_NOTIFICATION_TYPES.ADDRESSBOOK_EDIT_ENTRY: {
      notificationsQueue = addressBookEditEntry
      break
    }
    case TX_NOTIFICATION_TYPES.ADDRESSBOOK_DELETE_ENTRY: {
      notificationsQueue = addressBookDeleteEntry
      break
    }
    default: {
      notificationsQueue = defaultNotificationsQueue
      break
    }
  }

  return notificationsQueue
}

export const enhanceSnackbarForAction = (notification: Notification, key?: string, onClick?: Function) => ({
  ...notification,
  key,
  options: {
    ...notification.options,
    onClick,
    // eslint-disable-next-line react/display-name
    action: (actionKey: number) => (
      <IconButton onClick={() => store.dispatch(closeSnackbarAction({ key: actionKey }))}>
        <IconClose />
      </IconButton>
    ),
  },
})

export const showSnackbar = (notification: Notification, enqueueSnackbar: Function, closeSnackbar: Function) =>
  enqueueSnackbar(notification.message, {
    ...notification.options,
    // eslint-disable-next-line react/display-name
    action: key => (
      <IconButton onClick={() => closeSnackbar(key)}>
        <IconClose />
      </IconButton>
    ),
  })
