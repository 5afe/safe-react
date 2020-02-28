// @flow
import { Map } from 'immutable'
import { createAction } from 'redux-actions'

import { type Token } from '~/logic/tokens/store/model/token'

export const ADD_TOKENS = 'ADD_TOKENS'

type TokenProps = {
  tokens: Map<string, Token>,
}

const addTokens = createAction<string, *, *>(ADD_TOKENS, (tokens: Map<string, Token>): TokenProps => ({
  tokens,
}))

export default addTokens
