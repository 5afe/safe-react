// @flow

export type Notifications = {
  // Default
  BEFORE_EXECUTION_OR_CREATION: string,
  AFTER_EXECUTION: string,
  CREATED_MORE_CONFIRMATIONS_NEEDED: string,
  ERROR: string,

  // Wallet Connection
  CONNECT_WALLET_MSG: string,
  CONNECT_WALLET_READ_MODE_MSG: string,
  WALLET_CONNECTED_MSG: string,
  UNLOCK_WALLET_MSG: string,
  CONNECT_WALLET_ERROR_MSG: string,

  // Regular/Custom Transactions
  SIGN_TX_MSG: string,
  TX_PENDING_MSG: string,
  TX_PENDING_MORE_CONFIRMATIONS_MSG: string,
  TX_REJECTED_MSG: string,
  TX_EXECUTED_MSG: string,
  TX_FAILED_MSG: string,

  // Approval Transactions
  TX_CONFIRMATION_PENDING_MSG: string,
  TX_CONFIRMATION_EXECUTED_MSG: string,
  TX_CONFIRMATION_FAILED_MSG: string,

  // Safe Name
  SAFE_NAME_CHANGED_MSG: string,

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
  // Default
  BEFORE_EXECUTION_OR_CREATION: 'Transaction in progress',
  AFTER_EXECUTION: 'Transaction successfully executed',
  CREATED_MORE_CONFIRMATIONS_NEEDED: 'Transaction in progress: More confirmations required to execute',
  ERROR: 'Transaction failed',

  // Wallet Connection
  CONNECT_WALLET_MSG: 'Please connect wallet to continue',
  CONNECT_WALLET_READ_MODE_MSG: 'You are in read-only mode: Please connect wallet',
  WALLET_CONNECTED_MSG: 'Wallet connected',
  UNLOCK_WALLET_MSG: 'Unlock your wallet to connect',
  CONNECT_WALLET_ERROR_MSG: 'Error connecting to your wallet',

  // Regular/Custom Transactions
  SIGN_TX_MSG: 'Please sign the transaction',
  TX_PENDING_MSG: 'Transaction pending',
  TX_PENDING_MORE_CONFIRMATIONS_MSG: 'Transaction pending: More confirmations required to execute',
  TX_REJECTED_MSG: 'Transaction rejected',
  TX_EXECUTED_MSG: 'Transaction successfully executed',
  TX_FAILED_MSG: 'Transaction failed',

  // Approval Transactions
  TX_CONFIRMATION_PENDING_MSG: 'Confirmation transaction pending',
  TX_CONFIRMATION_EXECUTED_MSG: 'Confirmation transaction succesful',
  TX_CONFIRMATION_FAILED_MSG: 'Confirmation transaction failed',

  // Safe Name
  SAFE_NAME_CHANGED_MSG: 'Safe name changed',

  // Owners
  SIGN_OWNER_CHANGE_MSG: 'Please sign the owner change',
  ONWER_CHANGE_PENDING_MSG: 'Owner change pending',
  ONWER_CHANGE_PENDING_MORE_CONFIRMATIONS_MSG: 'Owner change pending: More confirmations required to execute',
  ONWER_CHANGE_REJECTED_MSG: 'Owner change rejected',
  ONWER_CHANGE_EXECUTED_MSG: 'Owner change successfully executed',
  ONWER_CHANGE_FAILED_MSG: 'Owner change failed',

  // Threshold
  SIGN_THRESHOLD_CHANGE_MSG: 'Please sign the required confirmations change',
  THRESHOLD_CHANGE_PENDING_MSG: 'Required confirmations change pending',
  THRESHOLD_CHANGE_PENDING_MORE_CONFIRMATIONS_MSG: 'Required confirmations change pending: More confirmations required to execute',
  THRESHOLD_CHANGE_REJECTED_MSG: 'Required confirmations change rejected',
  THRESHOLD_CHANGE_EXECUTED_MSG: 'Required confirmations change successfully executed',
  THRESHOLD_CHANGE_FAILED_MSG: 'Required confirmations change failed',

  // Network
  RINKEBY_VERSION_MSG: 'Rinkeby Version: Don\'t send mainnet assets to this Safe',
  WRONG_NETWORK_RINKEBY_MSG: 'Wrong network: Please use Rinkeby',
  WRONG_NETWOEK_MAINNET_MSG: 'Wrong network: Please use Mainnet',
}
