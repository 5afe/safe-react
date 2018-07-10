// @flow
import { createAction } from 'redux-actions'
import { type Token } from '~/routes/tokens/store/model/token'

export const ENABLE_TOKEN = 'ENABLE_TOKEN'

const enableToken = createAction(
  ENABLE_TOKEN,
  (safeAddress: string, token: Token) => ({
    safeAddress,
    symbol: token.get('symbol'),
  }),
)

export default enableToken
