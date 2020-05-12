// @flow
import { createAction } from 'redux-actions'

export const ADD_CANCELLATION_TRANSACTION = 'ADD_CANCELLATION_TRANSACTION'

export const addCancellationTransaction = createAction<string, *>(ADD_CANCELLATION_TRANSACTION)
