// @flow
import { createAction } from 'redux-actions'
import { type Token } from '~/routes/tokens/store/model/token'

export const ADD_TOKEN = 'ADD_TOKEN'

type AddTokenProps = {
  safeAddress: string,
  token: Token,
}

const addToken = createAction(
  ADD_TOKEN,
  (safeAddress: string, token: Token): AddTokenProps => ({
    safeAddress,
    token,
  }),
)

export default addToken
