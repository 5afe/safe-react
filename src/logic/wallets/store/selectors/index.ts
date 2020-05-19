import { createSelector } from 'reselect'

import { ETHEREUM_NETWORK, ETHEREUM_NETWORK_IDS } from 'src/logic/wallets/getWeb3'
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
  const network = ETHEREUM_NETWORK_IDS[networkId] || ETHEREUM_NETWORK.UNKNOWN

  return network
})

export const loadedSelector = createSelector(providerSelector, (provider) => provider.get('loaded'))

export const availableSelector = createSelector(providerSelector, (provider) => provider.get('available'))
