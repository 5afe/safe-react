// @flow
import type { Dispatch as ReduxDispatch } from 'redux'
import { makeProvider, type ProviderProps, type Provider } from '~/logic/wallets/store/model/provider'
import addProvider from './addProvider'

export default (enqueueSnackbar: Function) => async (dispatch: ReduxDispatch<*>) => {
  const providerProps: ProviderProps = {
    name: '',
    available: false,
    loaded: false,
    account: '',
    network: 0,
  }

  const provider: Provider = makeProvider(providerProps)
  enqueueSnackbar('Wallet disconnected succesfully', 'info')

  dispatch(addProvider(provider))
}
