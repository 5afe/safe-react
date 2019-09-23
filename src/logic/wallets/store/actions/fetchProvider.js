// @flow
import type { Dispatch as ReduxDispatch } from 'redux'
import { ETHEREUM_NETWORK_IDS, ETHEREUM_NETWORK } from '~/logic/wallets/getWeb3'
import type { ProviderProps } from '~/logic/wallets/store/model/provider'
import { makeProvider } from '~/logic/wallets/store/model/provider'
import { NOTIFICATIONS } from '~/logic/notifications'
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

const handleProviderNotification = (enqueueSnackbar: Function, closeSnackbar: Function, provider: ProviderProps) => {
  const { loaded, available, network } = provider

  if (!loaded) {
    enqueueSnackbar(NOTIFICATIONS.CONNECT_WALLET_ERROR_MSG.description, NOTIFICATIONS.CONNECT_WALLET_ERROR_MSG.options)
    return
  }

  if (ETHEREUM_NETWORK_IDS[network] !== ETHEREUM_NETWORK.RINKEBY) {
    enqueueSnackbar(
      NOTIFICATIONS.WRONG_NETWORK_RINKEBY_MSG.description,
      NOTIFICATIONS.WRONG_NETWORK_RINKEBY_MSG.options,
    )
    return
  }
  enqueueSnackbar(NOTIFICATIONS.RINKEBY_VERSION_MSG.description, NOTIFICATIONS.RINKEBY_VERSION_MSG.options)

  if (available) {
    enqueueSnackbar(NOTIFICATIONS.WALLET_CONNECTED_MSG.description, NOTIFICATIONS.WALLET_CONNECTED_MSG.options)
  } else {
    enqueueSnackbar(NOTIFICATIONS.UNLOCK_WALLET_MSG.description, NOTIFICATIONS.UNLOCK_WALLET_MSG.options)
  }
}

export default (
  provider: ProviderProps,
  enqueueSnackbar: Function,
  closeSnackbar: Function,
) => (dispatch: ReduxDispatch<*>) => {
  handleProviderNotification(enqueueSnackbar, closeSnackbar, provider)
  processProviderResponse(dispatch, provider)
}
