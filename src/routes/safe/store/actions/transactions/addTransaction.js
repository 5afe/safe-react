// @flow
import { createAction } from 'redux-actions'

export const ADD_TRANSACTION = 'ADD_TRANSACTION'

export const addTransaction = createAction<string, *>(ADD_TRANSACTION)
