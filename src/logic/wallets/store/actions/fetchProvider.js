// @flow
import type { Dispatch as ReduxDispatch } from 'redux'
import { getProviderInfo } from '~/logic/wallets/getWeb3'
import type { ProviderProps } from '~/logic/wallets/store/model/provider'
import { makeProvider } from '~/logic/wallets/store/model/provider'
import addProvider from './addProvider'

export const processProviderResponse = (dispatch: ReduxDispatch<*>, response: ProviderProps) => {
  const {
    name, available, loaded, account, network,
  } = response

  const walletRecord = makeProvider({
    name, available, loaded, account, network,
  })

  dispatch(addProvider(walletRecord))
}

const SUCCESS_MSG = 'Wallet connected sucessfully'
const UNLOCK_MSG = 'Unlock your wallet to connect'

export default (openSnackbar: Function) => async (dispatch: ReduxDispatch<*>) => {
  const response: ProviderProps = await getProviderInfo()

  const { loaded } = response
  const msg = loaded ? SUCCESS_MSG : UNLOCK_MSG
  const variant = loaded ? 'success' : 'warning'
  openSnackbar(msg, variant)

  processProviderResponse(dispatch, response)
}
