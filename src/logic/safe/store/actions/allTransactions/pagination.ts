import { createAction } from 'redux-actions'

export const LOAD_MORE_TRANSACTIONS = 'LOAD_MORE_TRANSACTIONS'

export const loadMore = createAction(LOAD_MORE_TRANSACTIONS)
