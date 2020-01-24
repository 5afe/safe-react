// @flow
import type { Dispatch as ReduxDispatch } from 'redux'
import ReactGA from 'react-ga'
import { ETHEREUM_NETWORK_IDS, ETHEREUM_NETWORK, getProviderInfo } from '~/logic/wallets/getWeb3'
import { getNetwork } from '~/config'
import type { ProviderProps } from '~/logic/wallets/store/model/provider'
import { makeProvider } from '~/logic/wallets/store/model/provider'
import { NOTIFICATIONS, enhanceSnackbarForAction } from '~/logic/notifications'
import enqueueSnackbar from '~/logic/notifications/store/actions/enqueueSnackbar'

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

const handleProviderNotification = (provider: ProviderProps, dispatch: Function) => {
  const { loaded, network, available } = provider

  if (!loaded) {
    dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.CONNECT_WALLET_ERROR_MSG)))
    return
  }

  if (ETHEREUM_NETWORK_IDS[network] !== getNetwork()) {
    dispatch(enqueueSnackbar(NOTIFICATIONS.WRONG_NETWORK_MSG))
    return
  }
  if (ETHEREUM_NETWORK.RINKEBY === getNetwork()) {
    dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.RINKEBY_VERSION_MSG)))
  }

  if (available) {
    // NOTE:
    // if you want to be able to dispatch a `closeSnackbar` action later on,
    // you SHOULD pass your own `key` in the options. `key` can be any sequence
    // of number or characters, but it has to be unique to a given snackbar.

    ReactGA.event({
      category: 'Wallets',
      action: 'Connect a wallet',
      label: provider.name,
    })
    dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.WALLET_CONNECTED_MSG)))
  } else {
    dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.UNLOCK_WALLET_MSG)))
  }
}

export default (provider: Object) => async (dispatch: ReduxDispatch<*>) => {
  const providerInfo: ProviderProps = await getProviderInfo(provider)
  await handleProviderNotification(providerInfo, dispatch)
  processProviderResponse(dispatch, providerInfo)
}
