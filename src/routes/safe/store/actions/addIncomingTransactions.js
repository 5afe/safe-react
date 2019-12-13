// @flow
import { createAction } from 'redux-actions'

export const ADD_INCOMING_TRANSACTIONS = 'ADD_INCOMING_TRANSACTIONS'

export const addIncomingTransactions = createAction<string, *>(ADD_INCOMING_TRANSACTIONS)
