import { createAction } from 'redux-actions'

export const UPDATE_TRANSACTION = 'UPDATE_TRANSACTION'

const updateTransaction = createAction(UPDATE_TRANSACTION)

export default updateTransaction
