import { Dispatch } from 'src/logic/safe/store/actions/types.d'
import { createAction } from 'redux-actions'

import { onboard } from 'src/components/ConnectButton'
import { NOTIFICATIONS, enhanceSnackbarForAction } from 'src/logic/notifications'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import { resetWeb3 } from 'src/logic/wallets/getWeb3'

export const REMOVE_PROVIDER = 'REMOVE_PROVIDER'

const removeProvider = createAction(REMOVE_PROVIDER)

export default () => (dispatch: Dispatch): void => {
  onboard.walletReset()
  resetWeb3()

  dispatch(removeProvider())
  dispatch(
    enqueueSnackbar(
      enhanceSnackbarForAction(NOTIFICATIONS.WALLET_DISCONNECTED_MSG, NOTIFICATIONS.WALLET_DISCONNECTED_MSG.key),
    ),
  )
}
