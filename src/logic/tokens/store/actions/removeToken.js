// @flow
import { createAction } from 'redux-actions'
import { type Token } from '~/logic/tokens/store/model/token'

export const REMOVE_TOKEN = 'REMOVE_TOKEN'

type RemoveTokenProps = {
  safeAddress: string,
  token: Token,
}

const removeToken = createAction(
  REMOVE_TOKEN,
  (safeAddress: string, token: Token): RemoveTokenProps => ({
    safeAddress,
    token,
  }),
)

export default removeToken
