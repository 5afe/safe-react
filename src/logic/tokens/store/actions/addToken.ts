import { createAction } from 'redux-actions'
import { Token } from 'src/logic/tokens/store/model/token'

export const ADD_TOKEN = 'ADD_TOKEN'

export const addToken = createAction(ADD_TOKEN, (token: Token) => ({
  token,
}))
