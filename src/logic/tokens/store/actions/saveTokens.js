import { createAction } from 'redux-actions'

export const ADD_TOKENS = 'ADD_TOKENS'

const addTokens = createAction(ADD_TOKENS, (tokens) => ({
  tokens,
}))

export default addTokens
