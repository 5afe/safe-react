// @flow
import { createAction } from 'redux-actions'

export const UPDATE_TRANSACTION = 'UPDATE_TRANSACTION'

const updateTransaction = createAction<string, *>(UPDATE_TRANSACTION)

export default updateTransaction
