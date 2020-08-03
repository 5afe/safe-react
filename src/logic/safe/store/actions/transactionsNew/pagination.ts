import { createAction } from 'redux-actions'

export const LOAD_MORE_TRANSACTIONS = 'ADD_NEW_TRANSACTIONS'

export const loadMore = createAction(LOAD_MORE_TRANSACTIONS)
