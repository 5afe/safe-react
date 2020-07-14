import { createSelector } from 'reselect'

import { ETHEREUM_NETWORK, ETHEREUM_NETWORK_IDS } from 'src/logic/wallets/getWeb3'
import { PROVIDER_REDUCER_ID, ProviderState } from 'src/logic/wallets/store/reducer/provider'
import { AppReduxState } from 'src/store'

export const providerSelector = (state: AppReduxState): ProviderState => state[PROVIDER_REDUCER_ID]

export const userAccountSelector = createSelector(providerSelector, (provider: ProviderState): string => {
  const account = provider.get('account')
  return account || ''
})

export const providerNameSelector = createSelector(providerSelector, (provider: ProviderState): string | undefined => {
  const name = provider.get('name')
  return name ? name.toLowerCase() : undefined
})

export const networkSelector = createSelector(providerSelector, (provider: ProviderState): string => {
  const networkId = provider.get('network')
  return ETHEREUM_NETWORK_IDS[networkId] || ETHEREUM_NETWORK.UNKNOWN
})

export const loadedSelector = createSelector(providerSelector, (provider: ProviderState): boolean =>
  provider.get('loaded'),
)

export const availableSelector = createSelector(providerSelector, (provider: ProviderState): boolean =>
  provider.get('available'),
)
