import { createAction } from 'redux-actions'

export const ADD_TOKENS = 'ADD_TOKENS'

export const addTokens = createAction(ADD_TOKENS, (tokens) => ({
  tokens,
}))
