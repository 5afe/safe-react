//
import { createAction } from 'redux-actions'

import {} from 'logic/tokens/store/model/token'
import { removeFromActiveTokens, removeTokenFromStorage } from 'logic/tokens/utils/tokensStorage'
import {} from 'store/index'

export const REMOVE_TOKEN = 'REMOVE_TOKEN'

export const removeToken = createAction(REMOVE_TOKEN, (safeAddress, token) => ({
  safeAddress,
  token,
}))

const deleteToken = (safeAddress, token) => async (dispatch) => {
  dispatch(removeToken(safeAddress, token))

  await removeFromActiveTokens(safeAddress, token)
  await removeTokenFromStorage(safeAddress, token)
}

export default deleteToken
