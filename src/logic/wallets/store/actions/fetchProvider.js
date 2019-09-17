// @flow
import type { Dispatch as ReduxDispatch } from 'redux'
import { ETHEREUM_NETWORK_IDS, ETHEREUM_NETWORK } from '~/logic/wallets/getWeb3'
import type { ProviderProps } from '~/logic/wallets/store/model/provider'
import { makeProvider } from '~/logic/wallets/store/model/provider'
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

const SUCCESS_MSG = 'Wallet connected sucessfully'
const UNLOCK_MSG = 'Unlock your wallet to connect'
const WRONG_NETWORK = 'You are connected to wrong network. Please use RINKEBY'
export const WALLET_ERROR_MSG = 'Error connecting to your wallet'

const handleProviderNotification = (enqueueSnackbar: Function, provider: ProviderProps) => {
  const { loaded, available, network } = provider

  if (!loaded) {
    enqueueSnackbar(WALLET_ERROR_MSG, 'error')
    return
  }

  if (ETHEREUM_NETWORK_IDS[network] !== ETHEREUM_NETWORK.RINKEBY) {
    enqueueSnackbar(WRONG_NETWORK, 'error')
    return
  }

  const msg = available ? SUCCESS_MSG : UNLOCK_MSG
  const variant = available ? 'success' : 'warning'
  enqueueSnackbar(msg, variant)
}

export default (provider: ProviderProps, enqueueSnackbar: Function) => (dispatch: ReduxDispatch<*>) => {
  handleProviderNotification(enqueueSnackbar, provider)
  processProviderResponse(dispatch, provider)
}
