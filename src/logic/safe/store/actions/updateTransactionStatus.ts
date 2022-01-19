import { createAction } from 'redux-actions'

import { TransactionStatusPayload } from 'src/logic/safe/store/reducer/localTransactions'

export const UPDATE_TRANSACTION_STATUS = 'UPDATE_TRANSACTION_STATUS'
export const updateTransactionStatus = createAction<TransactionStatusPayload>(UPDATE_TRANSACTION_STATUS)
