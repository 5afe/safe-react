// @flow
import { createAction } from 'redux-actions'
import type { Dispatch as ReduxDispatch } from 'redux'
import { NOTIFICATIONS, showSnackbar } from '~/logic/notifications'

export const REMOVE_PROVIDER = 'REMOVE_PROVIDER'

const removeProvider = createAction<string, *, *>(REMOVE_PROVIDER)

export default (enqueueSnackbar: Function, closeSnackbar: Function) => (dispatch: ReduxDispatch<*>) => {
  showSnackbar(NOTIFICATIONS.WALLET_DISCONNECTED_MSG, enqueueSnackbar, closeSnackbar)

  // remove info about current wallet connect session on disconnect so it's not used later
  // TODO: use a method for killing the session from web3connect when they provide one
  localStorage.removeItem('walletconnect')

  dispatch(removeProvider())
}
