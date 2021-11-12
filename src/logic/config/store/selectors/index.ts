import { createSelector } from 'reselect'

import { AppReduxState } from 'src/store'

export const networkConfigState = (state: AppReduxState): AppReduxState['networkConfig'] => state['networkConfig']

export const currentChainId = createSelector(
  [networkConfigState],
  (networkConfig): AppReduxState['networkConfig']['chainId'] => {
    return networkConfig.chainId
  },
)

export const currentShortName = createSelector(
  [networkConfigState],
  (networkConfig): AppReduxState['networkConfig']['shortName'] => {
    return networkConfig.shortName
  },
)

export const theme = createSelector([networkConfigState], (networkConfig): AppReduxState['networkConfig']['theme'] => {
  return networkConfig.theme
})
