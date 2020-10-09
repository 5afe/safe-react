import { OptionsObject } from 'notistack'

import { getNetworkName } from 'src/config'

export const SUCCESS = 'success'
export const ERROR = 'error'
export const WARNING = 'warning'
export const INFO = 'info'

const shortDuration = 5000
const longDuration = 10000

export type NotificationId = keyof typeof NOTIFICATION_IDS

export type Notification = {
  message: string
  options: OptionsObject
  key?: number | string
}

const NOTIFICATION_IDS = {
  CONNECT_WALLET_MSG: 'CONNECT_WALLET_MSG',
  CONNECT_WALLET_READ_MODE_MSG: 'CONNECT_WALLET_READ_MODE_MSG',
  WALLET_CONNECTED_MSG: 'WALLET_CONNECTED_MSG',
  WALLET_DISCONNECTED_MSG: 'WALLET_DISCONNECTED_MSG',
  UNLOCK_WALLET_MSG: 'UNLOCK_WALLET_MSG',
  CONNECT_WALLET_ERROR_MSG: 'CONNECT_WALLET_ERROR_MSG',
  SIGN_TX_MSG: 'SIGN_TX_MSG',
  TX_PENDING_MSG: 'TX_PENDING_MSG',
  TX_REJECTED_MSG: 'TX_REJECTED_MSG',
  TX_EXECUTED_MSG: 'TX_EXECUTED_MSG',
  TX_CANCELLATION_EXECUTED_MSG: 'TX_CANCELLATION_EXECUTED_MSG',
  TX_FAILED_MSG: 'TX_FAILED_MSG',
  TX_EXECUTED_MORE_CONFIRMATIONS_MSG: 'TX_EXECUTED_MORE_CONFIRMATIONS_MSG',
  TX_WAITING_MSG: 'TX_WAITING_MSG',
  TX_INCOMING_MSG: 'TX_INCOMING_MSG',
  TX_CONFIRMATION_PENDING_MSG: 'TX_CONFIRMATION_PENDING_MSG',
  TX_CONFIRMATION_EXECUTED_MSG: 'TX_CONFIRMATION_EXECUTED_MSG',
  TX_CONFIRMATION_FAILED_MSG: 'TX_CONFIRMATION_FAILED_MSG',
  SAFE_NAME_CHANGED_MSG: 'SAFE_NAME_CHANGED_MSG',
  OWNER_NAME_CHANGE_EXECUTED_MSG: 'OWNER_NAME_CHANGE_EXECUTED_MSG',
  SIGN_SETTINGS_CHANGE_MSG: 'SIGN_SETTINGS_CHANGE_MSG',
  SETTINGS_CHANGE_PENDING_MSG: 'SETTINGS_CHANGE_PENDING_MSG',
  SETTINGS_CHANGE_REJECTED_MSG: 'SETTINGS_CHANGE_REJECTED_MSG',
  SETTINGS_CHANGE_EXECUTED_MSG: 'SETTINGS_CHANGE_EXECUTED_MSG',
  SETTINGS_CHANGE_EXECUTED_MORE_CONFIRMATIONS_MSG: 'SETTINGS_CHANGE_EXECUTED_MORE_CONFIRMATIONS_MSG',
  SETTINGS_CHANGE_FAILED_MSG: 'SETTINGS_CHANGE_FAILED_MSG',
  TESTNET_VERSION_MSG: 'TESTNET_VERSION_MSG',
  WRONG_NETWORK_MSG: 'WRONG_NETWORK_MSG',
  ADDRESS_BOOK_NEW_ENTRY_SUCCESS: 'ADDRESS_BOOK_NEW_ENTRY_SUCCESS',
  ADDRESS_BOOK_EDIT_ENTRY_SUCCESS: 'ADDRESS_BOOK_EDIT_ENTRY_SUCCESS',
  ADDRESS_BOOK_DELETE_ENTRY_SUCCESS: 'ADDRESS_BOOK_DELETE_ENTRY_SUCCESS',
  SAFE_NEW_VERSION_AVAILABLE: 'SAFE_NEW_VERSION_AVAILABLE',
}

export const NOTIFICATIONS: Record<NotificationId, Notification> = {
  // Wallet Connection
  CONNECT_WALLET_MSG: {
    message: 'Please connect wallet to continue',
    options: { variant: WARNING, persist: true, preventDuplicate: true },
  },
  CONNECT_WALLET_READ_MODE_MSG: {
    message: 'You are in read-only mode: Please connect wallet',
    options: { variant: WARNING, persist: true, preventDuplicate: true },
  },
  WALLET_CONNECTED_MSG: {
    message: 'Wallet connected',
    options: {
      variant: SUCCESS,
      persist: false,
      autoHideDuration: shortDuration,
    },
  },
  WALLET_DISCONNECTED_MSG: {
    message: 'Wallet disconnected',
    key: 'WALLET_DISCONNECTED_MSG',
    options: {
      variant: SUCCESS,
      persist: false,
      autoHideDuration: shortDuration,
      preventDuplicate: true,
    },
  },
  UNLOCK_WALLET_MSG: {
    message: 'Unlock your wallet to connect',
    options: { variant: WARNING, persist: true, preventDuplicate: true },
  },
  CONNECT_WALLET_ERROR_MSG: {
    message: 'Error connecting to your wallet',
    options: { variant: ERROR, persist: true },
  },

  // Regular/Custom Transactions
  SIGN_TX_MSG: {
    message: 'Please sign the transaction',
    options: { variant: INFO, persist: true },
  },
  TX_PENDING_MSG: {
    message: 'Transaction pending',
    options: { variant: INFO, persist: true },
  },
  TX_REJECTED_MSG: {
    message: 'Transaction rejected',
    options: { variant: ERROR, persist: false, autoHideDuration: longDuration },
  },
  TX_EXECUTED_MSG: {
    message: 'Transaction successfully executed',
    options: { variant: SUCCESS, persist: false, autoHideDuration: longDuration },
  },
  TX_CANCELLATION_EXECUTED_MSG: {
    message: 'Rejection successfully submitted',
    options: { variant: SUCCESS, persist: false, autoHideDuration: longDuration },
  },
  TX_EXECUTED_MORE_CONFIRMATIONS_MSG: {
    message: 'Transaction successfully created. More confirmations needed to execute',
    options: { variant: SUCCESS, persist: false, autoHideDuration: longDuration },
  },
  TX_FAILED_MSG: {
    message: 'Transaction failed',
    options: { variant: ERROR, persist: false, autoHideDuration: longDuration },
  },
  TX_WAITING_MSG: {
    message: 'A pending transaction requires your confirmation!',
    key: 'TX_WAITING_MSG',
    options: {
      variant: WARNING,
      persist: true,
      preventDuplicate: true,
    },
  },
  TX_INCOMING_MSG: {
    message: 'Incoming transfer: ',
    key: 'TX_INCOMING_MSG',
    options: {
      variant: SUCCESS,
      persist: false,
      autoHideDuration: longDuration,
      preventDuplicate: true,
    },
  },

  // Approval Transactions
  TX_CONFIRMATION_PENDING_MSG: {
    message: 'Confirmation transaction pending',
    options: { variant: INFO, persist: true },
  },
  TX_CONFIRMATION_EXECUTED_MSG: {
    message: 'Confirmation transaction was successful',
    options: { variant: SUCCESS, persist: false, autoHideDuration: longDuration },
  },
  TX_CONFIRMATION_FAILED_MSG: {
    message: 'Confirmation transaction failed',
    options: { variant: ERROR, persist: false, autoHideDuration: longDuration },
  },

  // Safe Name
  SAFE_NAME_CHANGED_MSG: {
    message: 'Safe name changed',
    options: { variant: SUCCESS, persist: false, autoHideDuration: shortDuration },
  },

  // Owner Name
  OWNER_NAME_CHANGE_EXECUTED_MSG: {
    message: 'Owner name changed',
    options: { variant: SUCCESS, persist: false, autoHideDuration: shortDuration },
  },

  // Settings
  SIGN_SETTINGS_CHANGE_MSG: {
    message: 'Please sign the settings change',
    options: { variant: INFO, persist: true },
  },
  SETTINGS_CHANGE_PENDING_MSG: {
    message: 'Settings change pending',
    options: { variant: INFO, persist: true },
  },
  SETTINGS_CHANGE_REJECTED_MSG: {
    message: 'Settings change rejected',
    options: { variant: ERROR, persist: false, autoHideDuration: longDuration },
  },
  SETTINGS_CHANGE_EXECUTED_MSG: {
    message: 'Settings change successfully executed',
    options: { variant: SUCCESS, persist: false, autoHideDuration: longDuration },
  },
  SETTINGS_CHANGE_EXECUTED_MORE_CONFIRMATIONS_MSG: {
    message: 'Settings change successfully created. More confirmations needed to execute',
    options: { variant: SUCCESS, persist: false, autoHideDuration: longDuration },
  },
  SETTINGS_CHANGE_FAILED_MSG: {
    message: 'Settings change failed',
    options: { variant: ERROR, persist: false, autoHideDuration: longDuration },
  },

  // Network
  TESTNET_VERSION_MSG: {
    message: "Testnet Version: Don't send production assets to this Safe",
    options: { variant: WARNING, persist: true, preventDuplicate: true },
  },
  WRONG_NETWORK_MSG: {
    message: `Wrong network: Please use ${getNetworkName()}`,
    options: { variant: WARNING, persist: true, preventDuplicate: true },
  },

  // Address book
  ADDRESS_BOOK_NEW_ENTRY_SUCCESS: {
    message: 'Entry created successfully',
    options: { variant: SUCCESS, persist: false, preventDuplicate: false },
  },
  ADDRESS_BOOK_EDIT_ENTRY_SUCCESS: {
    message: 'Entry saved successfully',
    options: { variant: SUCCESS, persist: false, preventDuplicate: false },
  },
  ADDRESS_BOOK_DELETE_ENTRY_SUCCESS: {
    message: 'Entry deleted successfully',
    options: { variant: SUCCESS, persist: false, preventDuplicate: false },
  },

  // Safe Version
  SAFE_NEW_VERSION_AVAILABLE: {
    message: 'There is a new version available for this Safe. Update now!',
    options: { variant: WARNING, persist: false, preventDuplicate: true },
  },
}
