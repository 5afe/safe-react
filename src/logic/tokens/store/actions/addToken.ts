import { createAction } from 'redux-actions'

export const ADD_TOKEN = 'ADD_TOKEN'

export const addToken = createAction(ADD_TOKEN, (token) => ({
  token,
}))
