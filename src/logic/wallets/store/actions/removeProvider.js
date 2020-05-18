// 
import { createAction } from 'redux-actions'

import { onboard } from '~/components/ConnectButton'
import { NOTIFICATIONS, enhanceSnackbarForAction } from '~/logic/notifications'
import enqueueSnackbar from '~/logic/notifications/store/actions/enqueueSnackbar'
import { resetWeb3 } from '~/logic/wallets/getWeb3'

export const REMOVE_PROVIDER = 'REMOVE_PROVIDER'

const removeProvider = createAction(REMOVE_PROVIDER)

export default () => (dispatch) => {
  onboard.walletReset()
  resetWeb3()
  dispatch(removeProvider())
  dispatch(
    enqueueSnackbar(
      enhanceSnackbarForAction(NOTIFICATIONS.WALLET_DISCONNECTED_MSG, NOTIFICATIONS.WALLET_DISCONNECTED_MSG.key),
    ),
  )
}
