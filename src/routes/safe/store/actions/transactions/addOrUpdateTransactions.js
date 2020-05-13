// @flow
import { createAction } from 'redux-actions'

export const ADD_OR_UPDATE_TRANSACTIONS = 'ADD_OR_UPDATE_TRANSACTIONS'

export const addOrUpdateTransactions = createAction<string, *>(ADD_OR_UPDATE_TRANSACTIONS)
