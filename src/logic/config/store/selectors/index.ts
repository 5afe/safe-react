import { createSelector } from 'reselect'
import { ETHEREUM_NETWORK } from 'src/config/networks/network.d'

import { AppReduxState } from 'src/store'
import { NativeCurrency } from 'src/logic/config/model/networkConfig'

export const networkConfigState = (state: AppReduxState): AppReduxState['networkConfig'] => state['networkConfig']

export const currentChainId = createSelector([networkConfigState], (networkConfig): ETHEREUM_NETWORK => {
  return networkConfig.chainId
})

export const currentChainName = createSelector([networkConfigState], (networkConfig): string => {
  return networkConfig.chainName
})

export const currentNativeCurrency = createSelector([networkConfigState], (networkConfig): NativeCurrency => {
  return networkConfig.nativeCurrency
})

export const theme = createSelector([networkConfigState], (networkConfig): AppReduxState['networkConfig']['theme'] => {
  return networkConfig.theme
})
