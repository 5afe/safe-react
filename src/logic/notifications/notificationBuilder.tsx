import { IconButton } from '@material-ui/core'
import { Close as IconClose } from '@material-ui/icons'
import * as React from 'react'

import { Notification, NOTIFICATIONS } from './notificationTypes'

import closeSnackbarAction from 'src/logic/notifications/store/actions/closeSnackbar'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import { getAppInfoFromOrigin } from 'src/routes/safe/components/Apps/utils'
import { store } from 'src/store'

const setNotificationOrigin = (notification: Notification, origin: string): Notification => {
  if (!origin) {
    return notification
  }

  const appInfo = getAppInfoFromOrigin(origin)
  return { ...notification, message: `${appInfo ? appInfo.name : 'Unknown origin'}: ${notification.message}` }
}

const getStandardTxNotificationsQueue = (
  origin: string,
): Record<string, Record<string, Notification> | Notification> => ({
  beforeExecution: setNotificationOrigin(NOTIFICATIONS.SIGN_TX_MSG, origin),
  pendingExecution: setNotificationOrigin(NOTIFICATIONS.TX_PENDING_MSG, origin),
  afterRejection: setNotificationOrigin(NOTIFICATIONS.TX_REJECTED_MSG, origin),
  afterExecution: {
    noMoreConfirmationsNeeded: setNotificationOrigin(NOTIFICATIONS.TX_EXECUTED_MSG, origin),
    moreConfirmationsNeeded: setNotificationOrigin(NOTIFICATIONS.TX_EXECUTED_MORE_CONFIRMATIONS_MSG, origin),
  },
  afterExecutionError: setNotificationOrigin(NOTIFICATIONS.TX_FAILED_MSG, origin),
})

const waitingTransactionNotificationsQueue = {
  beforeExecution: null,
  pendingExecution: null,
  afterRejection: null,
  waitingConfirmation: NOTIFICATIONS.TX_WAITING_MSG,
  afterExecution: null,
  afterExecutionError: null,
}

const getConfirmationTxNotificationsQueue = (origin: string) => {
  return {
    beforeExecution: setNotificationOrigin(NOTIFICATIONS.SIGN_TX_MSG, origin),
    pendingExecution: setNotificationOrigin(NOTIFICATIONS.TX_CONFIRMATION_PENDING_MSG, origin),
    afterRejection: setNotificationOrigin(NOTIFICATIONS.TX_REJECTED_MSG, origin),
    afterExecution: {
      noMoreConfirmationsNeeded: setNotificationOrigin(NOTIFICATIONS.TX_EXECUTED_MSG, origin),
      moreConfirmationsNeeded: setNotificationOrigin(NOTIFICATIONS.TX_CONFIRMATION_EXECUTED_MSG, origin),
    },
    afterExecutionError: setNotificationOrigin(NOTIFICATIONS.TX_CONFIRMATION_FAILED_MSG, origin),
  }
}

const getCancellationTxNotificationsQueue = (origin: string) => {
  return {
    beforeExecution: setNotificationOrigin(NOTIFICATIONS.SIGN_TX_MSG, origin),
    pendingExecution: setNotificationOrigin(NOTIFICATIONS.TX_PENDING_MSG, origin),
    afterRejection: setNotificationOrigin(NOTIFICATIONS.TX_REJECTED_MSG, origin),
    afterExecution: {
      noMoreConfirmationsNeeded: setNotificationOrigin(NOTIFICATIONS.TX_EXECUTED_MSG, origin),
      moreConfirmationsNeeded: setNotificationOrigin(NOTIFICATIONS.TX_CANCELLATION_EXECUTED_MSG, origin),
    },
    afterExecutionError: setNotificationOrigin(NOTIFICATIONS.TX_FAILED_MSG, origin),
  }
}

const safeNameChangeNotificationsQueue = {
  beforeExecution: null,
  pendingExecution: null,
  afterRejection: null,
  afterExecution: {
    noMoreConfirmationsNeeded: NOTIFICATIONS.SAFE_NAME_CHANGED_MSG,
    moreConfirmationsNeeded: null,
  },
  afterExecutionError: null,
}

const ownerNameChangeNotificationsQueue = {
  beforeExecution: null,
  pendingExecution: null,
  afterRejection: null,
  afterExecution: {
    noMoreConfirmationsNeeded: NOTIFICATIONS.OWNER_NAME_CHANGE_EXECUTED_MSG,
    moreConfirmationsNeeded: null,
  },
  afterExecutionError: null,
}

const settingsChangeTxNotificationsQueue = {
  beforeExecution: NOTIFICATIONS.SIGN_SETTINGS_CHANGE_MSG,
  pendingExecution: NOTIFICATIONS.SETTINGS_CHANGE_PENDING_MSG,
  afterRejection: NOTIFICATIONS.SETTINGS_CHANGE_REJECTED_MSG,
  afterExecution: {
    noMoreConfirmationsNeeded: NOTIFICATIONS.SETTINGS_CHANGE_EXECUTED_MSG,
    moreConfirmationsNeeded: NOTIFICATIONS.SETTINGS_CHANGE_EXECUTED_MORE_CONFIRMATIONS_MSG,
  },
  afterExecutionError: NOTIFICATIONS.SETTINGS_CHANGE_FAILED_MSG,
}

const defaultNotificationsQueue = {
  beforeExecution: NOTIFICATIONS.SIGN_TX_MSG,
  pendingExecution: NOTIFICATIONS.TX_PENDING_MSG,
  afterRejection: NOTIFICATIONS.TX_REJECTED_MSG,
  afterExecution: {
    noMoreConfirmationsNeeded: NOTIFICATIONS.TX_EXECUTED_MSG,
    moreConfirmationsNeeded: NOTIFICATIONS.TX_EXECUTED_MORE_CONFIRMATIONS_MSG,
  },
  afterExecutionError: NOTIFICATIONS.TX_FAILED_MSG,
}

const addressBookNewEntry = {
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

const addressBookEditEntry = {
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

const addressBookDeleteEntry = {
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

export const getNotificationsFromTxType: any = (txType, origin) => {
  let notificationsQueue

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

export const enhanceSnackbarForAction = (
  notification: Notification,
  key?: number | string,
  onClick?: () => void,
): Notification => ({
  ...notification,
  key: key || notification.key,
  options: {
    ...notification.options,
    onClick,
    // eslint-disable-next-line react/display-name
    action: (actionKey) => (
      <IconButton onClick={() => store.dispatch(closeSnackbarAction({ key: actionKey }))}>
        <IconClose />
      </IconButton>
    ),
  },
})
