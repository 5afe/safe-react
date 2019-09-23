// @flow
import { NOTIFICATIONS } from './notificationTypes'
import { NOTIFIED_TRANSACTIONS } from '~/logic/safe/transactions'

type NotificationsQueue = {
  beforeExecution: Notification,
  pendingExecution: {
    single: Notification,
    multiple: Notification,
  },
  afterExecution: Notification,
  afterExecutionError: Notification,
  afterRejection: Notification,
}

const standardTxNotificationsQueue: NotificationsQueue = {
  beforeExecution: NOTIFICATIONS.SIGN_TX_MSG,
  pendingExecution: {
    single: NOTIFICATIONS.TX_PENDING_MSG,
    multiple: NOTIFICATIONS.TX_PENDING_MORE_CONFIRMATIONS_MSG,
  },
  afterRejection: NOTIFICATIONS.TX_REJECTED_MSG,
  afterExecution: NOTIFICATIONS.TX_EXECUTED_MSG,
  afterExecutionError: NOTIFICATIONS.TX_FAILED_MSG,
}

const confirmationTxNotificationsQueue: NotificationsQueue = {
  beforeExecution: NOTIFICATIONS.SIGN_TX_MSG,
  pendingExecution: {
    single: NOTIFICATIONS.TX_CONFIRMATION_PENDING_MSG,
    multiple: null,
  },
  afterRejection: NOTIFICATIONS.TX_REJECTED_MSG,
  afterExecution: NOTIFICATIONS.TX_CONFIRMATION_EXECUTED_MSG,
  afterExecutionError: NOTIFICATIONS.TX_CONFIRMATION_FAILED_MSG,
}

const cancellationTxNotificationsQueue: NotificationsQueue = {
  beforeExecution: NOTIFICATIONS.SIGN_TX_MSG,
  pendingExecution: {
    single: NOTIFICATIONS.TX_PENDING_MSG,
    multiple: NOTIFICATIONS.TX_PENDING_MORE_CONFIRMATIONS_MSG,
  },
  afterRejection: NOTIFICATIONS.TX_REJECTED_MSG,
  afterExecution: NOTIFICATIONS.TX_EXECUTED_MSG,
  afterExecutionError: NOTIFICATIONS.TX_FAILED_MSG,
}

const ownerChangeTxNotificationsQueue: NotificationsQueue = {
  beforeExecution: NOTIFICATIONS.SIGN_OWNER_CHANGE_MSG,
  pendingExecution: {
    single: NOTIFICATIONS.ONWER_CHANGE_PENDING_MSG,
    multiple: NOTIFICATIONS.ONWER_CHANGE_PENDING_MORE_CONFIRMATIONS_MSG,
  },
  afterRejection: NOTIFICATIONS.ONWER_CHANGE_REJECTED_MSG,
  afterExecution: NOTIFICATIONS.OWNER_CHANGE_EXECUTED_MSG,
  afterExecutionError: NOTIFICATIONS.ONWER_CHANGE_FAILED_MSG,
}

const safeNameChangeNotificationsQueue: NotificationsQueue = {
  beforeExecution: null,
  pendingExecution: {
    single: null,
    multiple: null,
  },
  afterRejection: null,
  afterExecution: NOTIFICATIONS.SAFE_NAME_CHANGE_EXECUTED_MSG,
  afterExecutionError: null,
}

const ownerNameChangeNotificationsQueue: NotificationsQueue = {
  beforeExecution: null,
  pendingExecution: {
    single: null,
    multiple: null,
  },
  afterRejection: null,
  afterExecution: NOTIFICATIONS.OWNER_NAME_CHANGE_EXECUTED_MSG,
  afterExecutionError: null,
}

const thresholdChangeTxNotificationsQueue: NotificationsQueue = {
  beforeExecution: NOTIFICATIONS.SIGN_THRESHOLD_CHANGE_MSG,
  pendingExecution: {
    single: NOTIFICATIONS.THRESHOLD_CHANGE_PENDING_MSG,
    multiple: NOTIFICATIONS.THRESHOLD_CHANGE_PENDING_MORE_CONFIRMATIONS_MSG,
  },
  afterRejection: NOTIFICATIONS.THRESHOLD_CHANGE_REJECTED_MSG,
  afterExecution: NOTIFICATIONS.THRESHOLD_CHANGE_EXECUTED_MSG,
  afterExecutionError: NOTIFICATIONS.THRESHOLD_CHANGE_FAILED_MSG,
}

const defaultNotificationsQueue: NotificationsQueue = {
  beforeExecution: NOTIFICATIONS.SIGN_TX_MSG,
  pendingExecution: {
    single: NOTIFICATIONS.TX_PENDING_MSG,
    multiple: NOTIFICATIONS.TX_PENDING_MORE_CONFIRMATIONS_MSG,
  },
  afterRejection: NOTIFICATIONS.TX_REJECTED_MSG,
  afterExecution: NOTIFICATIONS.TX_EXECUTED_MSG,
  afterExecutionError: NOTIFICATIONS.TX_FAILED_MSG,
}

export const getNofiticationsFromTxType = (txType: string) => {
  let notificationsQueue: NotificationsQueue

  switch (txType) {
    case NOTIFIED_TRANSACTIONS.CONNECT_WALLET_TX: {
      break
    }
    case NOTIFIED_TRANSACTIONS.STANDARD_TX: {
      notificationsQueue = standardTxNotificationsQueue
      break
    }
    case NOTIFIED_TRANSACTIONS.CONFIRMATION_TX: {
      notificationsQueue = confirmationTxNotificationsQueue
      break
    }
    case NOTIFIED_TRANSACTIONS.CANCELLATION_TX: {
      notificationsQueue = cancellationTxNotificationsQueue
      break
    }
    case NOTIFIED_TRANSACTIONS.OWNER_CHANGE_TX: {
      notificationsQueue = ownerChangeTxNotificationsQueue
      break
    }
    case NOTIFIED_TRANSACTIONS.SAFE_NAME_CHANGE_TX: {
      notificationsQueue = safeNameChangeNotificationsQueue
      break
    }
    case NOTIFIED_TRANSACTIONS.OWNER_NAME_CHANGE_TX: {
      notificationsQueue = ownerNameChangeNotificationsQueue
      break
    }
    case NOTIFIED_TRANSACTIONS.THRESHOLD_CHANGE_TX: {
      notificationsQueue = thresholdChangeTxNotificationsQueue
      break
    }
    case NOTIFIED_TRANSACTIONS.NETWORK_TX: {
      break
    }
    default: {
      notificationsQueue = defaultNotificationsQueue
      break
    }
  }

  return notificationsQueue
}
