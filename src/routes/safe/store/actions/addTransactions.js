// @flow
import { createAction } from 'redux-actions'

export const ADD_TRANSACTIONS = 'ADD_TRANSACTIONS'

export default createAction<string, *>(ADD_TRANSACTIONS)
