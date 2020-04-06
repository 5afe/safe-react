// 
import { Map } from 'immutable'
import { createAction } from 'redux-actions'

import { } from 'src/logic/tokens/store/model/token'

export const ADD_TOKENS = 'ADD_TOKENS'


const addTokens = createAction(ADD_TOKENS, (tokens) => ({
  tokens,
}))

export default addTokens
