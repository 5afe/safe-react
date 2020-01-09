// @flow
import { createAction } from 'redux-actions'

export const ADD_CANCEL_TRANSACTIONS = 'ADD_CANCEL_TRANSACTIONS'

export const addCancelTransactions = createAction<string, *>(ADD_CANCEL_TRANSACTIONS)
