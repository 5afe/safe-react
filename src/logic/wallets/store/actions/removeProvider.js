// @flow
import { createAction } from 'redux-actions'
import type { Dispatch as ReduxDispatch } from 'redux'
import { NOTIFICATIONS, showSnackbar } from '~/logic/notifications'

export const REMOVE_PROVIDER = 'REMOVE_PROVIDER'

const removeProvider = createAction<string, *, *>(REMOVE_PROVIDER)

export default (enqueueSnackbar: Function, closeSnackbar: Function) => (dispatch: ReduxDispatch<*>) => {
  showSnackbar(NOTIFICATIONS.WALLET_DISCONNECTED_MSG, enqueueSnackbar, closeSnackbar)

  dispatch(removeProvider())
}
