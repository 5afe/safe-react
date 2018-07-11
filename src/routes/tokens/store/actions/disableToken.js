// @flow
import { createAction } from 'redux-actions'
import { type Token } from '~/routes/tokens/store/model/token'

export const DISABLE_TOKEN = 'DISABLE_TOKEN'

const disableToken = createAction(
  DISABLE_TOKEN,
  (safeAddress: string, token: Token) => ({
    safeAddress,
    symbol: token.get('symbol'),
    address: token.get('address'),
  }),
)

export default disableToken
