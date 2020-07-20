import { createAction } from 'redux-actions'

export const ADD_NEW_TRANSACTIONS = 'ADD_NEW_TRANSACTIONS'

export const addNewTransactions = createAction(ADD_NEW_TRANSACTIONS)

export const SET_NEXT_PAGE = 'SET_NEXT_PAGE'

export const setNextPage = createAction(SET_NEXT_PAGE)

export const SET_PREVIOUS_PAGE = 'SET_PREVIOUS_PAGE'

export const setPreviousPage = createAction(SET_PREVIOUS_PAGE)
