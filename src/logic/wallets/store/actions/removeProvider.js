// @flow
import { createAction } from 'redux-actions'
import type { Dispatch as ReduxDispatch } from 'redux'
import { NOTIFICATIONS, enhanceSnackbarForAction } from '~/logic/notifications'
import { getWeb3, resetWeb3 } from '~/logic/wallets/getWeb3'
import enqueueSnackbar from '~/logic/notifications/store/actions/enqueueSnackbar'

export const REMOVE_PROVIDER = 'REMOVE_PROVIDER'

const removeProvider = createAction<string, *, *>(REMOVE_PROVIDER)

export default () => (dispatch: ReduxDispatch<*>) => {
  dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.WALLET_DISCONNECTED_MSG)))

  const web3 = getWeb3()

  if (web3.currentProvider && web3.currentProvider.close) {
    web3.currentProvider.close()
  }

  resetWeb3()
  dispatch(removeProvider())
}
