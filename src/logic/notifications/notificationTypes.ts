import { OptionsObject, SnackbarMessage } from 'notistack'

export enum VARIANT {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

const shortDuration = 5000
const longDuration = 10000

export type Notification = {
  message: SnackbarMessage
  options?: OptionsObject
  action?: unknown // Will specify the type when actions are added
}

enum NOTIFICATION_IDS {
  UNLOCK_WALLET_MSG,
  CONNECT_WALLET_ERROR_MSG,
  CREATE_SAFE_FAILED_MSG,
  SIGN_TX_MSG,
  TX_REJECTED_MSG,
  TX_EXECUTED_MSG,
  TX_CANCELLATION_EXECUTED_MSG,
  TX_FAILED_MSG,
  TX_PENDING_MSG,
  TX_PENDING_FAILED_MSG,
  TX_WAITING_MSG,
  TX_CONFIRMATION_EXECUTED_MSG,
  TX_CONFIRMATION_FAILED_MSG,
  TX_FETCH_SIGNATURES_ERROR_MSG,
  SAFE_APPS_FETCH_ERROR_MSG,
  SAFE_NAME_CHANGED_MSG,
  OWNER_NAME_CHANGE_EXECUTED_MSG,
  SIGN_SETTINGS_CHANGE_MSG,
  SETTINGS_CHANGE_REJECTED_MSG,
  SETTINGS_CHANGE_EXECUTED_MSG,
  SETTINGS_CHANGE_EXECUTED_MORE_CONFIRMATIONS_MSG,
  SETTINGS_CHANGE_FAILED_MSG,
  SIGN_NEW_SPENDING_LIMIT_MSG,
  NEW_SPENDING_LIMIT_REJECTED_MSG,
  NEW_SPENDING_LIMIT_EXECUTED_MSG,
  NEW_SPENDING_LIMIT_EXECUTED_MORE_CONFIRMATIONS_MSG,
  NEW_SPENDING_LIMIT_FAILED_MSG,
  SPENDING_LIMIT_EXECUTED_MSG,
  SIGN_REMOVE_SPENDING_LIMIT_MSG,
  REMOVE_SPENDING_LIMIT_REJECTED_MSG,
  REMOVE_SPENDING_LIMIT_EXECUTED_MSG,
  REMOVE_SPENDING_LIMIT_EXECUTED_MORE_CONFIRMATIONS_MSG,
  REMOVE_SPENDING_LIMIT_FAILED_MSG,
  ADDRESS_BOOK_NEW_ENTRY_SUCCESS,
  ADDRESS_BOOK_EDIT_ENTRY_SUCCESS,
  ADDRESS_BOOK_IMPORT_ENTRIES_SUCCESS,
  ADDRESS_BOOK_DELETE_ENTRY_SUCCESS,
  ADDRESS_BOOK_EXPORT_ENTRIES_SUCCESS,
  ADDRESS_BOOK_EXPORT_ENTRIES_ERROR,
  SAFE_NEW_VERSION_AVAILABLE,
  SHARE_SAFE_APP_URL_COPIED,
}

export const NOTIFICATIONS: Record<keyof typeof NOTIFICATION_IDS, Notification> = {
  // Wallet Connection
  UNLOCK_WALLET_MSG: {
    message: 'Unlock your wallet to connect',
    options: { variant: VARIANT.WARNING, persist: true, preventDuplicate: true },
  },
  CONNECT_WALLET_ERROR_MSG: {
    message: 'Error connecting to your wallet',
    options: { variant: VARIANT.ERROR, persist: true },
  },
  // Safe creation
  CREATE_SAFE_FAILED_MSG: {
    message: 'Safe creation failed',
    options: { variant: VARIANT.ERROR, autoHideDuration: longDuration },
  },
  // Regular/Custom Transactions
  SIGN_TX_MSG: {
    message: 'Please sign the transaction',
    options: { variant: VARIANT.INFO, persist: true },
  },
  TX_REJECTED_MSG: {
    message: 'Transaction rejected',
    options: { variant: VARIANT.ERROR, autoHideDuration: shortDuration },
  },
  TX_EXECUTED_MSG: {
    message: 'Transaction successfully executed',
    options: { variant: VARIANT.SUCCESS, autoHideDuration: shortDuration },
  },
  TX_CANCELLATION_EXECUTED_MSG: {
    message: 'Rejection successfully submitted',
    options: { variant: VARIANT.SUCCESS, autoHideDuration: shortDuration },
  },
  TX_FAILED_MSG: {
    message: 'Transaction failed',
    options: { variant: VARIANT.ERROR, autoHideDuration: shortDuration },
  },
  TX_PENDING_MSG: {
    message: 'Transaction still pending. Consider resubmitting with a higher gas price.',
    options: { variant: VARIANT.ERROR, persist: true, autoHideDuration: shortDuration },
  },
  TX_PENDING_FAILED_MSG: {
    message: 'Transaction wasn’t mined, please make sure it was properly sent. Be aware that it might still be mined.',
    options: { variant: VARIANT.ERROR, persist: true, autoHideDuration: shortDuration },
  },
  TX_WAITING_MSG: {
    message: 'A transaction requires your confirmation',
    options: { variant: VARIANT.WARNING, autoHideDuration: shortDuration, preventDuplicate: true },
  },

  TX_CONFIRMATION_EXECUTED_MSG: {
    message: 'Confirmation transaction was successful',
    options: { variant: VARIANT.SUCCESS, autoHideDuration: shortDuration },
  },
  TX_CONFIRMATION_FAILED_MSG: {
    message: 'Confirmation transaction failed',
    options: { variant: VARIANT.ERROR, autoHideDuration: shortDuration },
  },

  TX_FETCH_SIGNATURES_ERROR_MSG: {
    message: 'Couldn’t fetch all signatures for this transaction. Please reload page and try again',
    options: { variant: VARIANT.ERROR, persist: true },
  },
  SAFE_APPS_FETCH_ERROR_MSG: {
    message: 'Error fetching the Safe Apps, please refresh the page',
    options: { variant: VARIANT.ERROR, autoHideDuration: shortDuration },
  },
  // Safe Name
  SAFE_NAME_CHANGED_MSG: {
    message: 'Safe name changed',
    options: { variant: VARIANT.SUCCESS, autoHideDuration: shortDuration },
  },

  // Owner Name
  OWNER_NAME_CHANGE_EXECUTED_MSG: {
    message: 'Owner name changed',
    options: { variant: VARIANT.SUCCESS, autoHideDuration: shortDuration },
  },

  // Settings
  SIGN_SETTINGS_CHANGE_MSG: {
    message: 'Please sign the settings change',
    options: { variant: VARIANT.INFO, persist: true },
  },
  SETTINGS_CHANGE_REJECTED_MSG: {
    message: 'Settings change rejected',
    options: { variant: VARIANT.ERROR, autoHideDuration: shortDuration },
  },
  SETTINGS_CHANGE_EXECUTED_MSG: {
    message: 'Settings change successfully executed',
    options: { variant: VARIANT.SUCCESS, autoHideDuration: shortDuration },
  },
  SETTINGS_CHANGE_EXECUTED_MORE_CONFIRMATIONS_MSG: {
    message: 'Settings change successfully created. More confirmations needed to execute',
    options: { variant: VARIANT.SUCCESS, autoHideDuration: longDuration },
  },
  SETTINGS_CHANGE_FAILED_MSG: {
    message: 'Settings change failed',
    options: { variant: VARIANT.ERROR, autoHideDuration: shortDuration },
  },

  // Spending limit
  SIGN_NEW_SPENDING_LIMIT_MSG: {
    message: 'Please sign the new spending limit',
    options: { variant: VARIANT.INFO, persist: true },
  },
  NEW_SPENDING_LIMIT_REJECTED_MSG: {
    message: 'New spending limit rejected',
    options: { variant: VARIANT.ERROR, autoHideDuration: longDuration },
  },
  NEW_SPENDING_LIMIT_EXECUTED_MSG: {
    message: 'New spending limit successfully executed',
    options: { variant: VARIANT.SUCCESS, autoHideDuration: longDuration },
  },
  SPENDING_LIMIT_EXECUTED_MSG: {
    message:
      'Your transaction has been submitted and will appear in the interface only after it has been successfully mined and indexed.',
    options: { variant: VARIANT.SUCCESS, autoHideDuration: longDuration },
  },
  NEW_SPENDING_LIMIT_EXECUTED_MORE_CONFIRMATIONS_MSG: {
    message: 'New spending limit successfully created. More confirmations needed to execute',
    options: { variant: VARIANT.SUCCESS, autoHideDuration: longDuration },
  },
  NEW_SPENDING_LIMIT_FAILED_MSG: {
    message: 'New spending limit failed',
    options: { variant: VARIANT.ERROR, autoHideDuration: longDuration },
  },
  SIGN_REMOVE_SPENDING_LIMIT_MSG: {
    message: 'Please sign the remove Spending limit',
    options: { variant: VARIANT.INFO, persist: true },
  },
  REMOVE_SPENDING_LIMIT_REJECTED_MSG: {
    message: 'Remove spending limit rejected',
    options: { variant: VARIANT.ERROR, autoHideDuration: longDuration },
  },
  REMOVE_SPENDING_LIMIT_EXECUTED_MSG: {
    message: 'Remove spending limit successfully executed',
    options: { variant: VARIANT.SUCCESS, autoHideDuration: longDuration },
  },
  REMOVE_SPENDING_LIMIT_EXECUTED_MORE_CONFIRMATIONS_MSG: {
    message: 'Remove spending limit successfully created. More confirmations needed to execute',
    options: { variant: VARIANT.SUCCESS, autoHideDuration: longDuration },
  },
  REMOVE_SPENDING_LIMIT_FAILED_MSG: {
    message: 'Remove spending limit failed',
    options: { variant: VARIANT.ERROR, autoHideDuration: longDuration },
  },

  // Address book
  ADDRESS_BOOK_NEW_ENTRY_SUCCESS: {
    message: 'Entry created successfully',
    options: { variant: VARIANT.SUCCESS },
  },
  ADDRESS_BOOK_EDIT_ENTRY_SUCCESS: {
    message: 'Entry saved successfully',
    options: { variant: VARIANT.SUCCESS },
  },
  ADDRESS_BOOK_IMPORT_ENTRIES_SUCCESS: {
    message: 'Entries imported successfully',
    options: { variant: VARIANT.SUCCESS },
  },
  ADDRESS_BOOK_DELETE_ENTRY_SUCCESS: {
    message: 'Entry deleted successfully',
    options: { variant: VARIANT.SUCCESS },
  },
  ADDRESS_BOOK_EXPORT_ENTRIES_SUCCESS: {
    message: 'Address book exported',
    options: { variant: VARIANT.SUCCESS },
  },
  ADDRESS_BOOK_EXPORT_ENTRIES_ERROR: {
    message: 'An error occurred while generating the address book CSV.',
    options: { variant: VARIANT.ERROR },
  },

  // Safe Version
  SAFE_NEW_VERSION_AVAILABLE: {
    message: 'There is a new version available for this Safe. Update now!',
    options: { variant: VARIANT.WARNING, preventDuplicate: true },
  },

  // Copy to clipboard
  SHARE_SAFE_APP_URL_COPIED: {
    message: 'Safe App URL copied to clipboard!',
    options: { variant: VARIANT.INFO, preventDuplicate: true },
  },
}
