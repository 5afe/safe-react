import { createSelector } from 'reselect'
import { ETHEREUM_NETWORK } from 'src/config/networks/network.d'

import { AppReduxState } from 'src/store'

export const networkConfigState = (state: AppReduxState): AppReduxState['networkConfig'] => state['networkConfig']

export const currentChainId = createSelector([networkConfigState], (networkConfig): ETHEREUM_NETWORK => {
  return networkConfig.chainId
})

export const theme = createSelector([networkConfigState], (networkConfig): AppReduxState['networkConfig']['theme'] => {
  return networkConfig.theme
})
