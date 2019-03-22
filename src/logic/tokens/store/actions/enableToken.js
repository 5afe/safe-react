// @flow
import { createAction } from 'redux-actions'
import { type Token } from '~/logic/tokens/store/model/token'

export const ENABLE_TOKEN = 'ENABLE_TOKEN'

const enableToken = createAction(ENABLE_TOKEN, (safeAddress: string, token: Token) => ({
  safeAddress,
  address: token.get('address'),
}))

const setTokenEnabled = (safeAddress: string, token: Token) => (dispatch: ReduxDispatch<GlobalState>) => {
  dispatch(enableToken(safeAddress, token))
}

export default setTokenEnabled
