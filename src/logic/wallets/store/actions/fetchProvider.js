// @flow
import type { Dispatch as ReduxDispatch } from 'redux'
import { ETHEREUM_NETWORK_IDS, ETHEREUM_NETWORK } from '~/logic/wallets/getWeb3'
import type { ProviderProps } from '~/logic/wallets/store/model/provider'
import { makeProvider } from '~/logic/wallets/store/model/provider'
import {
  type Variant, SUCCESS, ERROR, WARNING,
} from '~/components/Header'
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


const CONNECT_WALLET_MSG = 'Please connect wallet to continue'
const CONNECT_WALLET_READ_MODE_MSG = 'You are in read-only mode: Please connect wallet'
const UNLOCK_MSG = 'Unlock your wallet to connect'
const WRONG_NETWORK_RINKEBY_MSG = 'Wrong network: Please use Rinkeby'
const SUCCESS_MSG = 'Wallet connected'
export const WALLET_ERROR_MSG = 'Error connecting to your wallet'

const handleProviderNotification = (
  enqueueSnackbar: (message: string, variant: Variant) => void,
  provider: ProviderProps,
) => {
  const { loaded, available, network } = provider

  if (!loaded) {
    enqueueSnackbar(WALLET_ERROR_MSG, { variant: ERROR })
    return
  }

  if (ETHEREUM_NETWORK_IDS[network] !== ETHEREUM_NETWORK.RINKEBY) {
    enqueueSnackbar(WRONG_NETWORK_RINKEBY_MSG, { variant: ERROR, persist: true })
    return
  }

  const msg = available ? SUCCESS_MSG : UNLOCK_MSG
  const variant = { variant: (available ? SUCCESS : WARNING) }
  enqueueSnackbar(msg, variant)
}

export default (provider: ProviderProps, enqueueSnackbar: (message: string, variant: Variant) => void) => (
  dispatch: ReduxDispatch<*>,
) => {
  handleProviderNotification(enqueueSnackbar, provider)
  processProviderResponse(dispatch, provider)
}
