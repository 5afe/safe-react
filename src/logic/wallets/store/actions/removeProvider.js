// @flow
import type { Dispatch as ReduxDispatch } from 'redux'
import { makeProvider, type ProviderProps, type Provider } from '~/logic/wallets/store/model/provider'
import { NOTIFICATIONS, showSnackbar } from '~/logic/notifications'
import addProvider from './addProvider'

export default (enqueueSnackbar: Function, closeSnackbar: Function) => async (dispatch: ReduxDispatch<*>) => {
  const providerProps: ProviderProps = {
    name: '',
    available: false,
    loaded: false,
    account: '',
    network: 0,
  }

  const provider: Provider = makeProvider(providerProps)
  showSnackbar(NOTIFICATIONS.WALLET_DISCONNECTED_MSG, enqueueSnackbar, closeSnackbar)

  dispatch(addProvider(provider))
}
