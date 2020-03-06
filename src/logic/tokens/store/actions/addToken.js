// @flow
import { createAction } from 'redux-actions'

import { type Token } from '~/logic/tokens/store/model/token'

export const ADD_TOKEN = 'ADD_TOKEN'

type AddTokenProps = {
  token: Token,
}

export const addToken = createAction<string, *, *>(ADD_TOKEN, (token: Token): AddTokenProps => ({
  token,
}))
