import { createAction } from 'redux-actions'

export const LOAD_MORE_TRANSACTIONS = 'ADD_NEW_TRANSACTIONS'

export const loadMore = createAction(LOAD_MORE_TRANSACTIONS)

export const SET_NEXT_PAGE = 'SET_NEXT_PAGE'

export const nextPage = createAction(SET_NEXT_PAGE)

export const SET_PREVIOUS_PAGE = 'SET_PREVIOUS_PAGE'

export const previousPage = createAction(SET_PREVIOUS_PAGE)
