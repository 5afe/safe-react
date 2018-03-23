// @flow
import type { Dispatch as ReduxDispatch } from 'redux'
import { getProviderInfo } from '~/wallets/getWeb3'
import type { ProviderProps } from '~/wallets/store/model/provider'
import { makeProvider } from '~/wallets/store/model/provider'
import addProvider from './addProvider'

export const processProviderResponse = (dispatch: ReduxDispatch<*>, response: ProviderProps) => {
  const {
    name, available, loaded, account,
  } = response

  const walletRecord = makeProvider({
    name, available, loaded, account,
  })

  dispatch(addProvider(walletRecord))
}

export default () => async (dispatch: ReduxDispatch<*>) => {
  const response: ProviderProps = await getProviderInfo()

  processProviderResponse(dispatch, response)
}
