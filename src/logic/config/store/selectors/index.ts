import { createSelector } from 'reselect'

import { AppReduxState } from 'src/store'
import { CONFIG_REDUCER_ID } from '../reducer'
import { ChainId } from 'src/config/chain.d'

export const configState = (state: AppReduxState): AppReduxState[typeof CONFIG_REDUCER_ID] => state[CONFIG_REDUCER_ID]

export const currentChainId = createSelector([configState], (config): ChainId => {
  return config.chainId
})
