// @flow
export type Notifications = {
  BEFORE_EXECUTION_OR_CREATION: string,
  AFTER_EXECUTION: string,
  CREATED_MORE_CONFIRMATIONS_NEEDED: string,
  ERROR: string,
}

export const DEFAULT_NOTIFICATIONS: Notifications = {
  BEFORE_EXECUTION_OR_CREATION: 'Transaction in progress',
  AFTER_EXECUTION: 'Transaction successfully executed',
  CREATED_MORE_CONFIRMATIONS_NEEDED: 'Transaction in progress: More confirmations required to execute',
  ERROR: 'Transaction failed',
}
