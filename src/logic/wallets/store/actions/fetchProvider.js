// @flow
import type { Dispatch as ReduxDispatch } from 'redux'
import { ETHEREUM_NETWORK_IDS, ETHEREUM_NETWORK } from '~/logic/wallets/getWeb3'
import type { ProviderProps } from '~/logic/wallets/store/model/provider'
import { makeProvider } from '~/logic/wallets/store/model/provider'
import { NOTIFICATIONS } from '~/logic/notifications'
// import enqueueSnackbar as enqueueSnackbarAction from '~/logic/notifications/store/actions/enqueueSnackbar'
// import closeSnackbar as closeSnackbarAction from '~/logic/notifications/store/actions/closeSnackbar'
import addProvider from './addProvider'

export const processProviderResponse = (dispatch: ReduxDispatch<*>, provider: ProviderProps) => {
  const {
    name, available, loaded, account, network,
  } = provider

  const walletRecord = makeProvider({
    name,
    available,
    loaded,
    account,
    network,
  })

  dispatch(addProvider(walletRecord))
}

const handleProviderNotification = (dispatch: ReduxDispatch<*>, provider: ProviderProps, enqueueSnackbar: Function) => {
  const { loaded, available, network } = provider

  if (!loaded) {
    enqueueSnackbar(NOTIFICATIONS.CONNECT_WALLET_ERROR_MSG.message, NOTIFICATIONS.CONNECT_WALLET_ERROR_MSG.options)
    return
  }

  if (ETHEREUM_NETWORK_IDS[network] !== ETHEREUM_NETWORK.RINKEBY) {
    enqueueSnackbar(
      NOTIFICATIONS.WRONG_NETWORK_RINKEBY_MSG.message,
      NOTIFICATIONS.WRONG_NETWORK_RINKEBY_MSG.options,
    )
    return
  }
  enqueueSnackbar(NOTIFICATIONS.RINKEBY_VERSION_MSG.message, NOTIFICATIONS.RINKEBY_VERSION_MSG.options)

  if (available) {
    // NOTE:
    // if you want to be able to dispatch a `closeSnackbar` action later on,
    // you SHOULD pass your own `key` in the options. `key` can be any sequence
    // of number or characters, but it has to be unique to a given snackbar.

    // dispatch(enqueueSnackbarAction(NOTIFICATIONS.WALLET_CONNECTED_MSG))
    enqueueSnackbar(NOTIFICATIONS.WALLET_CONNECTED_MSG.message, NOTIFICATIONS.WALLET_CONNECTED_MSG.options)
  } else {
    enqueueSnackbar(NOTIFICATIONS.UNLOCK_WALLET_MSG.message, NOTIFICATIONS.UNLOCK_WALLET_MSG.options)
  }
}

export default (provider: ProviderProps, enqueueSnackbar: Function) => (dispatch: ReduxDispatch<*>) => {
  handleProviderNotification(dispatch, provider, enqueueSnackbar)
  processProviderResponse(dispatch, provider)
}
