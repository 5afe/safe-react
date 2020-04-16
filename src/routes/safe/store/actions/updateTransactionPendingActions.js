// @flow
import { createAction } from 'redux-actions'

export const UPDATE_TRANSACTION_PENDING_ACTIONS = 'UPDATE_TRANSACTION'

const updateTransactionPendingActions = createAction<string, *>(UPDATE_TRANSACTION_PENDING_ACTIONS)

export default updateTransactionPendingActions
