// @flow
import { Map } from 'immutable'
import { createAction } from 'redux-actions'
import { type Token } from '~/routes/tokens/store/model/token'

export const ADD_TOKENS = 'ADD_TOKENS'

type TokenProps = {
  safeAddress: string,
  tokens: Map<string, Token>,
}

const addTokens = createAction(
  ADD_TOKENS,
  (safeAddress: string, tokens: Map<string, Token>): TokenProps => ({
    safeAddress,
    tokens,
  }),
)

export default addTokens
