// @flow
import { createAction } from 'redux-actions'

export const ADD_TRANSACTIONS = 'ADD_TRANSACTIONS'
export const addTransactions = createAction<string, *>(ADD_TRANSACTIONS)
