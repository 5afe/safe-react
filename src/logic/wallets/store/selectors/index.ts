import { createSelector } from 'reselect'

import { ETHEREUM_NETWORK } from 'src/logic/wallets/getWeb3'
import { PROVIDER_REDUCER_ID } from 'src/logic/wallets/store/reducer/provider'

export const providerSelector = (state) => state[PROVIDER_REDUCER_ID]

export const userAccountSelector = createSelector(providerSelector, (provider) => {
  const account = provider.get('account')

  return account || ''
})

export const providerNameSelector = createSelector(providerSelector, (provider) => {
  const name = provider.get('name')

  return name ? name.toLowerCase() : undefined
})

export const networkSelector = createSelector(providerSelector, (provider) => {
  const networkId = provider.get('network')

  return networkId ?? ETHEREUM_NETWORK.UNKNOWN
})

export const loadedSelector = createSelector(providerSelector, (provider) => provider.get('loaded'))

export const availableSelector = createSelector(providerSelector, (provider) => provider.get('available'))
