// @flow
import { createAction } from 'redux-actions'
import type { Dispatch as ReduxDispatch } from 'redux'
import { NOTIFICATIONS, enhanceSnackbarForAction } from '~/logic/notifications'
import { resetWeb3 } from '~/logic/wallets/getWeb3'
import { onboard } from '~/components/ConnectButton'
import enqueueSnackbar from '~/logic/notifications/store/actions/enqueueSnackbar'

export const REMOVE_PROVIDER = 'REMOVE_PROVIDER'

const removeProvider = createAction<string, *, *>(REMOVE_PROVIDER)

export default () => (dispatch: ReduxDispatch<*>) => {
  dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.WALLET_DISCONNECTED_MSG)))

  onboard.walletReset()
  resetWeb3()

  dispatch(removeProvider())
}
