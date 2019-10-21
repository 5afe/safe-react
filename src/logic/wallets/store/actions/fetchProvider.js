// @flow
import type { Dispatch as ReduxDispatch } from 'redux'
import { ETHEREUM_NETWORK_IDS, ETHEREUM_NETWORK } from '~/logic/wallets/constants'
import type { ProviderProps } from '~/logic/wallets/store/model/provider'
import { makeProvider } from '~/logic/wallets/store/model/provider'
import { NOTIFICATIONS, showSnackbar } from '~/logic/notifications'
import { getNetwork } from '~/config'
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

const handleProviderNotification = (
  provider: ProviderProps,
  enqueueSnackbar: Function,
  closeSnackbar: Function,
) => {
  const { loaded, available, network } = provider

  if (!loaded) {
    showSnackbar(NOTIFICATIONS.CONNECT_WALLET_ERROR_MSG, enqueueSnackbar, closeSnackbar)
    return
  }

  if (ETHEREUM_NETWORK_IDS[network] !== getNetwork()) {
    showSnackbar(NOTIFICATIONS.WRONG_NETWORK_MSG, enqueueSnackbar, closeSnackbar)
    return
  }
  if (ETHEREUM_NETWORK.RINKEBY === getNetwork()) {
    showSnackbar(NOTIFICATIONS.RINKEBY_VERSION_MSG, enqueueSnackbar, closeSnackbar)
  }

  if (available) {
    // NOTE:
    // if you want to be able to dispatch a `closeSnackbar` action later on,
    // you SHOULD pass your own `key` in the options. `key` can be any sequence
    // of number or characters, but it has to be unique to a given snackbar.

    showSnackbar(NOTIFICATIONS.WALLET_CONNECTED_MSG, enqueueSnackbar, closeSnackbar)
  } else {
    showSnackbar(NOTIFICATIONS.UNLOCK_WALLET_MSG, enqueueSnackbar, closeSnackbar)
  }
}

export default (provider: ProviderProps, enqueueSnackbar: Function, closeSnackbar: Function) => (
  dispatch: ReduxDispatch<*>,
) => {
  handleProviderNotification(provider, enqueueSnackbar, closeSnackbar)
  processProviderResponse(dispatch, provider)
  handleProviderNotification(dispatch, provider)
}
