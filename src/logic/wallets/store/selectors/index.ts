import { createSelector } from 'reselect'
import { ChainId, CHAIN_ID } from 'src/config/chain.d'

import { currentChainId } from 'src/logic/config/store/selectors'
import { PROVIDER_REDUCER_ID, ProvidersState } from 'src/logic/wallets/store/reducer'
import { AppReduxState } from 'src/store'

export const providerSelector = (state: AppReduxState): ProvidersState => state[PROVIDER_REDUCER_ID]

export const userAccountSelector = createSelector(providerSelector, ({ account }: ProvidersState): string => {
  return account
})

export const userEnsSelector = createSelector(providerSelector, ({ ensDomain }: ProvidersState): string => {
  return ensDomain
})

export const providerNameSelector = createSelector(providerSelector, ({ name }: ProvidersState): string | undefined => {
  return name
})

export const networkSelector = createSelector(providerSelector, ({ network }: ProvidersState): ChainId => {
  return network ?? CHAIN_ID.UNKNOWN
})

export const shouldSwitchWalletChain = createSelector(
  providerSelector,
  currentChainId,
  ({ account, network }: ProvidersState, currentChainId: ChainId): boolean => {
    return !!account && network !== currentChainId
  },
)

export const loadedSelector = createSelector(providerSelector, ({ loaded }: ProvidersState): boolean => {
  return loaded
})

export const availableSelector = createSelector(providerSelector, ({ available }: ProvidersState): boolean => {
  return available
})
