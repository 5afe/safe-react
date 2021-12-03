import { createSelector } from 'reselect'
import { ChainId, CHAIN_ID } from 'src/config/chain.d'

import { currentChainId } from 'src/logic/config/store/selectors'
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

export const networkSelector = createSelector(providerSelector, (provider: ProviderState): ChainId => {
  const networkId = provider.get('network')

  return networkId ?? CHAIN_ID.UNKNOWN
})

export const shouldSwitchWalletChain = createSelector(
  providerSelector,
  currentChainId,
  (provider: ProviderState, currentChainId: ChainId): boolean => {
    const account = provider.get('account')
    const networkId = provider.get('network').toString()
    return !!account && networkId !== currentChainId
  },
)

export const loadedSelector = createSelector(providerSelector, (provider: ProviderState): boolean =>
  provider.get('loaded'),
)

export const availableSelector = createSelector(providerSelector, (provider: ProviderState): boolean =>
  provider.get('available'),
)
