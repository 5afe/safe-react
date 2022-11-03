import { createAction } from 'redux-actions'

import { HistoryPayload, QueuedPayload, RemoveHistoryPayload } from 'src/logic/safe/store/reducer/gatewayTransactions'

export const ADD_HISTORY_TRANSACTIONS = 'ADD_HISTORY_TRANSACTIONS'
export const addHistoryTransactions = createAction<HistoryPayload>(ADD_HISTORY_TRANSACTIONS)

export const REMOVE_HISTORY_TRANSACTIONS = 'REMOVE_HISTORY_TRANSACTIONS'
export const removeHistoryTransactions = createAction<RemoveHistoryPayload>(REMOVE_HISTORY_TRANSACTIONS)

export const ADD_QUEUED_TRANSACTIONS = 'ADD_QUEUED_TRANSACTIONS'
export const addQueuedTransactions = createAction<QueuedPayload>(ADD_QUEUED_TRANSACTIONS)
