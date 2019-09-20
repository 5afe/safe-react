// @flow
export const SUCCESS = 'success'
export const ERROR = 'error'
export const WARNING = 'warning'
export const INFO = 'info'

const shortDuration = 5000
const longDuration = 10000

export type Variant = SUCCESS | ERROR | WARNING | INFO

export type Notification = {
  description: string,
  variant: Variant,
  persist: boolean,
  autoHideDuration?: shortDuration | longDuration,
}

export type Notifications = {
  // Wallet Connection
  CONNECT_WALLET_MSG: string,
  CONNECT_WALLET_READ_MODE_MSG: string,
  WALLET_CONNECTED_MSG: string,
  UNLOCK_WALLET_MSG: string,
  CONNECT_WALLET_ERROR_MSG: string,

  // Regular/Custom Transactions
  SIGN_TX_MSG: Notification,
  TX_PENDING_MSG: Notification,
  TX_PENDING_MORE_CONFIRMATIONS_MSG: Notification,
  TX_REJECTED_MSG: Notification,
  TX_EXECUTED_MSG: Notification,
  TX_FAILED_MSG: Notification,

  // Approval Transactions
  TX_CONFIRMATION_PENDING_MSG: string,
  TX_CONFIRMATION_EXECUTED_MSG: string,
  TX_CONFIRMATION_FAILED_MSG: string,

  // Safe Name
  SAFE_NAME_CHANGED_MSG: string,

  // Owner Name
  OWNER_NAME_CHANGE_EXECUTED_MSG: string,

  // Owners
  SIGN_OWNER_CHANGE_MSG: string,
  ONWER_CHANGE_PENDING_MSG: string,
  ONWER_CHANGE_PENDING_MORE_CONFIRMATIONS_MSG: string,
  ONWER_CHANGE_REJECTED_MSG: string,
  ONWER_CHANGE_EXECUTED_MSG: string,
  ONWER_CHANGE_FAILED_MSG: string,

  // Threshold
  SIGN_THRESHOLD_CHANGE_MSG: string,
  THRESHOLD_CHANGE_PENDING_MSG: string,
  THRESHOLD_CHANGE_PENDING_MORE_CONFIRMATIONS_MSG: string,
  THRESHOLD_CHANGE_REJECTED_MSG: string,
  THRESHOLD_CHANGE_EXECUTED_MSG: string,
  THRESHOLD_CHANGE_FAILED_MSG: string,

  // Rinkeby version
  RINKEBY_VERSION_MSG: string,
  WRONG_NETWORK_RINKEBY_MSG: string,
  WRONG_NETWOEK_MAINNET_MSG: string,
}

export const NOTIFICATIONS: Notifications = {
  // Wallet Connection
  CONNECT_WALLET_MSG: {
    description: 'Please connect wallet to continue',
    options: { variant: WARNING, persist: true },
  },
  CONNECT_WALLET_READ_MODE_MSG: {
    description: 'You are in read-only mode: Please connect wallet',
    options: { variant: WARNING, persist: true },
  },
  WALLET_CONNECTED_MSG: {
    description: 'Wallet connected',
    options: {
      variant: SUCCESS,
      persist: false,
      autoHideDuration: shortDuration,
      preventDuplicate: true,
    },
  },
  UNLOCK_WALLET_MSG: {
    description: 'Unlock your wallet to connect',
    options: { variant: WARNING, persist: true },
  },
  CONNECT_WALLET_ERROR_MSG: {
    description: 'Error connecting to your wallet',
    options: { variant: ERROR, persist: true },
  },

  // Regular/Custom Transactions
  SIGN_TX_MSG: {
    description: 'Please sign the transaction',
    options: { variant: SUCCESS, persist: true },
  },
  TX_PENDING_MSG: {
    description: 'Transaction pending',
    options: { variant: SUCCESS, persist: true },
  },
  TX_PENDING_MORE_CONFIRMATIONS_MSG: {
    description: 'Transaction pending: More confirmations required to execute',
    options: { variant: SUCCESS, persist: true },
  },
  TX_REJECTED_MSG: {
    description: 'Transaction rejected',
    options: { variant: ERROR, persist: false, autoHideDuration: longDuration },
  },
  TX_EXECUTED_MSG: {
    description: 'Transaction successfully executed',
    options: { variant: SUCCESS, persist: false, autoHideDuration: longDuration },
  },
  TX_FAILED_MSG: {
    description: 'Transaction failed',
    options: { variant: ERROR, persist: false, autoHideDuration: longDuration },
  },

  // Approval Transactions
  TX_CONFIRMATION_PENDING_MSG: {
    description: 'Confirmation transaction pending',
    options: { variant: SUCCESS, persist: true },
  },
  TX_CONFIRMATION_EXECUTED_MSG: {
    description: 'Confirmation transaction succesful',
    options: { variant: SUCCESS, persist: false, autoHideDuration: longDuration },
  },
  TX_CONFIRMATION_FAILED_MSG: {
    description: 'Confirmation transaction failed',
    options: { variant: ERROR, persist: false, autoHideDuration: longDuration },
  },

  // Safe Name
  SAFE_NAME_CHANGE_EXECUTED_MSG: {
    description: 'Safe name changed',
    options: { variant: SUCCESS, persist: false, autoHideDuration: shortDuration },
  },

  // Owner Name
  OWNER_NAME_CHANGE_EXECUTED_MSG: {
    description: 'Owner name changed',
    options: { variant: SUCCESS, persist: false, autoHideDuration: shortDuration },
  },

  // Owners
  SIGN_OWNER_CHANGE_MSG: {
    description: 'Please sign the owner change',
    options: { variant: SUCCESS, persist: true },
  },
  ONWER_CHANGE_PENDING_MSG: {
    description: 'Owner change pending',
    options: { variant: SUCCESS, persist: true },
  },
  ONWER_CHANGE_PENDING_MORE_CONFIRMATIONS_MSG: {
    description: 'Owner change pending: More confirmations required to execute',
    options: { variant: SUCCESS, persist: true },
  },
  ONWER_CHANGE_REJECTED_MSG: {
    description: 'Owner change rejected',
    options: { variant: ERROR, persist: false, autoHideDuration: longDuration },
  },
  OWNER_CHANGE_EXECUTED_MSG: {
    description: 'Owner change successfully executed',
    options: { variant: SUCCESS, persist: false, autoHideDuration: longDuration },
  },
  ONWER_CHANGE_FAILED_MSG: {
    description: 'Owner change failed',
    options: { variant: ERROR, persist: false, autoHideDuration: longDuration },
  },

  // Threshold
  SIGN_THRESHOLD_CHANGE_MSG: {
    description: 'Please sign the required confirmations change',
    options: { variant: SUCCESS, persist: true },
  },
  THRESHOLD_CHANGE_PENDING_MSG: {
    description: 'Required confirmations change pending',
    options: { variant: SUCCESS, persist: true },
  },
  THRESHOLD_CHANGE_PENDING_MORE_CONFIRMATIONS_MSG: {
    description: 'Required confirmations change pending: More confirmations required to execute',
    options: { variant: SUCCESS, persist: true },
  },
  THRESHOLD_CHANGE_REJECTED_MSG: {
    description: 'Required confirmations change rejected',
    options: { variant: ERROR, persist: false, autoHideDuration: longDuration },
  },
  THRESHOLD_CHANGE_EXECUTED_MSG: {
    description: 'Required confirmations change successfully executed',
    options: { variant: SUCCESS, persist: false, autoHideDuration: longDuration },
  },
  THRESHOLD_CHANGE_FAILED_MSG: {
    description: 'Required confirmations change failed',
    options: { variant: ERROR, persist: false, autoHideDuration: longDuration },
  },

  // Network
  RINKEBY_VERSION_MSG: {
    description: "Rinkeby Version: Don't send mainnet assets to this Safe",
    options: { variant: INFO, persist: true, hideIconVariant: true },
  },
  WRONG_NETWORK_RINKEBY_MSG: {
    description: 'Wrong network: Please use Rinkeby',
    options: { variant: WARNING, persist: true },
  },
  WRONG_NETWOEK_MAINNET_MSG: {
    description: 'Wrong network: Please use Mainnet',
    options: { variant: WARNING, persist: true },
  },
}
