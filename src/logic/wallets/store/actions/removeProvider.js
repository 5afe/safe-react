// @flow
import { createAction } from 'redux-actions'
import type { Dispatch as ReduxDispatch } from 'redux'
import { NOTIFICATIONS, showSnackbar } from '~/logic/notifications'
import { getWeb3 } from '~/logic/wallets/getWeb3'

export const REMOVE_PROVIDER = 'REMOVE_PROVIDER'

const removeProvider = createAction<string, *, *>(REMOVE_PROVIDER)

export default (enqueueSnackbar: Function, closeSnackbar: Function) => (dispatch: ReduxDispatch<*>) => {
  showSnackbar(NOTIFICATIONS.WALLET_DISCONNECTED_MSG, enqueueSnackbar, closeSnackbar)

  const web3 = getWeb3()

  if (web3.currentProvider && web3.currentProvider.close) {
    web3.currentProvider.close()
  }

  dispatch(removeProvider())
}
