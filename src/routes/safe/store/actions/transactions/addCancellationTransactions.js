// @flow
import { createAction } from 'redux-actions'

export const ADD_CANCELLATION_TRANSACTIONS = 'ADD_CANCELLATION_TRANSACTIONS'

export const addCancellationTransactions = createAction<string, *>(ADD_CANCELLATION_TRANSACTIONS)
