// @flow
import { createAction } from 'redux-actions'

export const UPDATE_CANCELLATION_TRANSACTION = 'UPDATE_CANCELLATION_TRANSACTION'

export const updateCancellationTransaction = createAction<string, *>(UPDATE_CANCELLATION_TRANSACTION)
