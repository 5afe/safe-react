// @flow
import { createSelector } from 'reselect'
import type { Provider } from '~/logic/wallets/store/model/provider'
import { PROVIDER_REDUCER_ID } from '~/logic/wallets/store/reducer/provider'
import { ETHEREUM_NETWORK_IDS, ETHEREUM_NETWORK } from '~/logic/wallets/getWeb3'

const providerSelector = (state: any): Provider => state[PROVIDER_REDUCER_ID]

export const userAccountSelector = createSelector(
  providerSelector,
  (provider: Provider) => {
    const account = provider.get('account')

    return account || ''
  },
)

export const providerNameSelector = createSelector(
  providerSelector,
  (provider: Provider) => {
    const name = provider.get('name')
    const loaded = provider.get('loaded')
    const available = provider.get('available')

    return loaded && available ? name.toLowerCase() : undefined
  },
)

export const networkSelector = createSelector(
  providerSelector,
  (provider: Provider) => {
    const networkId = provider.get('network')
    const network = ETHEREUM_NETWORK_IDS[networkId] || ETHEREUM_NETWORK.UNKNOWN

    return network
  },
)

export const loadedSelector = createSelector(
  providerSelector,
  (provider: Provider) => provider.get('loaded'),
)

export const availableSelector = createSelector(
  providerSelector,
  (provider: Provider) => provider.get('available'),
)
