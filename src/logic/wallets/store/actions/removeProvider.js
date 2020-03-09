// @flow
import type { Dispatch as ReduxDispatch } from 'redux'
import { createAction } from 'redux-actions'

import { onboard } from '~/components/ConnectButton'
import { NOTIFICATIONS, enhanceSnackbarForAction } from '~/logic/notifications'
import enqueueSnackbar from '~/logic/notifications/store/actions/enqueueSnackbar'
import { resetWeb3 } from '~/logic/wallets/getWeb3'

export const REMOVE_PROVIDER = 'REMOVE_PROVIDER'

const removeProvider = createAction<string, *, *>(REMOVE_PROVIDER)

export default () => (dispatch: ReduxDispatch<*>) => {
  onboard.walletReset()
  resetWeb3()
  dispatch(removeProvider())
  dispatch(
    enqueueSnackbar(
      enhanceSnackbarForAction(NOTIFICATIONS.WALLET_DISCONNECTED_MSG, NOTIFICATIONS.WALLET_DISCONNECTED_MSG.key),
    ),
  )
}
