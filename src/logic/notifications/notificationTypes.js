// @flow
export const SUCCESS = 'success'
export const ERROR = 'error'
export const WARNING = 'warning'
export const INFO = 'info'

const shortDuration = 5000
const longDuration = 10000

export type Variant = SUCCESS | ERROR | WARNING | INFO

export type Notification = {
  message: string,
  options: {
    variant: Variant,
    persist: boolean,
    autoHideDuration?: shortDuration | longDuration,
    preventDuplicate: boolean,
  },
}

export type Notifications = {
  // Wallet Connection
  CONNECT_WALLET_MSG: Notification,
  CONNECT_WALLET_READ_MODE_MSG: Notification,
  WALLET_CONNECTED_MSG: Notification,
  WALLET_DISCONNECTED_MSG: Notification,
  UNLOCK_WALLET_MSG: Notification,
  CONNECT_WALLET_ERROR_MSG: Notification,

  // Regular/Custom Transactions
  SIGN_TX_MSG: Notification,
  TX_PENDING_MSG: Notification,
  TX_PENDING_MORE_CONFIRMATIONS_MSG: Notification,
  TX_REJECTED_MSG: Notification,
  TX_EXECUTED_MSG: Notification,
  TX_FAILED_MSG: Notification,

  // Approval Transactions
  TX_CONFIRMATION_PENDING_MSG: Notification,
  TX_CONFIRMATION_EXECUTED_MSG: Notification,
  TX_CONFIRMATION_FAILED_MSG: Notification,

  // Safe Name
  SAFE_NAME_CHANGED_MSG: Notification,

  // Owner Name
  OWNER_NAME_CHANGE_EXECUTED_MSG: Notification,

  // Owners
  SIGN_OWNER_CHANGE_MSG: Notification,
  ONWER_CHANGE_PENDING_MSG: Notification,
  ONWER_CHANGE_PENDING_MORE_CONFIRMATIONS_MSG: Notification,
  ONWER_CHANGE_REJECTED_MSG: Notification,
  ONWER_CHANGE_EXECUTED_MSG: Notification,
  ONWER_CHANGE_FAILED_MSG: Notification,

  // Threshold
  SIGN_THRESHOLD_CHANGE_MSG: Notification,
  THRESHOLD_CHANGE_PENDING_MSG: Notification,
  THRESHOLD_CHANGE_PENDING_MORE_CONFIRMATIONS_MSG: Notification,
  THRESHOLD_CHANGE_REJECTED_MSG: Notification,
  THRESHOLD_CHANGE_EXECUTED_MSG: Notification,
  THRESHOLD_CHANGE_FAILED_MSG: Notification,

  // Rinkeby version
  RINKEBY_VERSION_MSG: Notification,
  WRONG_NETWORK_RINKEBY_MSG: Notification,
  WRONG_NETWOEK_MAINNET_MSG: Notification,
}

export const NOTIFICATIONS: Notifications = {
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
    options: {
      variant: SUCCESS,
      persist: false,
      autoHideDuration: shortDuration,
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
    options: { variant: SUCCESS, persist: true },
  },
  TX_PENDING_MSG: {
    message: 'Transaction pending',
    options: { variant: SUCCESS, persist: true },
  },
  TX_PENDING_MORE_CONFIRMATIONS_MSG: {
    message: 'Transaction pending: More confirmations required to execute',
    options: { variant: SUCCESS, persist: true },
  },
  TX_REJECTED_MSG: {
    message: 'Transaction rejected',
    options: { variant: ERROR, persist: false, autoHideDuration: longDuration },
  },
  TX_EXECUTED_MSG: {
    message: 'Transaction successfully executed',
    options: { variant: SUCCESS, persist: false, autoHideDuration: longDuration },
  },
  TX_FAILED_MSG: {
    message: 'Transaction failed',
    options: { variant: ERROR, persist: false, autoHideDuration: longDuration },
  },

  // Approval Transactions
  TX_CONFIRMATION_PENDING_MSG: {
    message: 'Confirmation transaction pending',
    options: { variant: SUCCESS, persist: true },
  },
  TX_CONFIRMATION_EXECUTED_MSG: {
    message: 'Confirmation transaction succesful',
    options: { variant: SUCCESS, persist: false, autoHideDuration: longDuration },
  },
  TX_CONFIRMATION_FAILED_MSG: {
    message: 'Confirmation transaction failed',
    options: { variant: ERROR, persist: false, autoHideDuration: longDuration },
  },

  // Safe Name
  SAFE_NAME_CHANGE_EXECUTED_MSG: {
    message: 'Safe name changed',
    options: { variant: SUCCESS, persist: false, autoHideDuration: shortDuration },
  },

  // Owner Name
  OWNER_NAME_CHANGE_EXECUTED_MSG: {
    message: 'Owner name changed',
    options: { variant: SUCCESS, persist: false, autoHideDuration: shortDuration },
  },

  // Owners
  SIGN_OWNER_CHANGE_MSG: {
    message: 'Please sign the owner change',
    options: { variant: SUCCESS, persist: true },
  },
  ONWER_CHANGE_PENDING_MSG: {
    message: 'Owner change pending',
    options: { variant: SUCCESS, persist: true },
  },
  ONWER_CHANGE_PENDING_MORE_CONFIRMATIONS_MSG: {
    message: 'Owner change pending: More confirmations required to execute',
    options: { variant: SUCCESS, persist: true },
  },
  ONWER_CHANGE_REJECTED_MSG: {
    message: 'Owner change rejected',
    options: { variant: ERROR, persist: false, autoHideDuration: longDuration },
  },
  OWNER_CHANGE_EXECUTED_MSG: {
    message: 'Owner change successfully executed',
    options: { variant: SUCCESS, persist: false, autoHideDuration: longDuration },
  },
  ONWER_CHANGE_FAILED_MSG: {
    message: 'Owner change failed',
    options: { variant: ERROR, persist: false, autoHideDuration: longDuration },
  },

  // Threshold
  SIGN_THRESHOLD_CHANGE_MSG: {
    message: 'Please sign the required confirmations change',
    options: { variant: SUCCESS, persist: true },
  },
  THRESHOLD_CHANGE_PENDING_MSG: {
    message: 'Required confirmations change pending',
    options: { variant: SUCCESS, persist: true },
  },
  THRESHOLD_CHANGE_PENDING_MORE_CONFIRMATIONS_MSG: {
    message: 'Required confirmations change pending: More confirmations required to execute',
    options: { variant: SUCCESS, persist: true },
  },
  THRESHOLD_CHANGE_REJECTED_MSG: {
    message: 'Required confirmations change rejected',
    options: { variant: ERROR, persist: false, autoHideDuration: longDuration },
  },
  THRESHOLD_CHANGE_EXECUTED_MSG: {
    message: 'Required confirmations change successfully executed',
    options: { variant: SUCCESS, persist: false, autoHideDuration: longDuration },
  },
  THRESHOLD_CHANGE_FAILED_MSG: {
    message: 'Required confirmations change failed',
    options: { variant: ERROR, persist: false, autoHideDuration: longDuration },
  },

  // Network
  RINKEBY_VERSION_MSG: {
    message: "Rinkeby Version: Don't send mainnet assets to this Safe",
    options: { variant: INFO, persist: true, preventDuplicate: true },
  },
  WRONG_NETWORK_RINKEBY_MSG: {
    message: 'Wrong network: Please use Rinkeby',
    options: { variant: WARNING, persist: true, preventDuplicate: true },
  },
  WRONG_NETWOEK_MAINNET_MSG: {
    message: 'Wrong network: Please use Mainnet',
    options: { variant: WARNING, persist: true, preventDuplicate: true },
  },
}
