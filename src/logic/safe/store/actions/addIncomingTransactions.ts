import { createAction } from 'redux-actions'

import { AddTxPayload } from 'src/logic/safe/store/reducer/incomingTransactions'

export const ADD_INCOMING_TRANSACTIONS = 'ADD_INCOMING_TRANSACTIONS'

export const addIncomingTransactions = createAction<AddTxPayload>(ADD_INCOMING_TRANSACTIONS)
