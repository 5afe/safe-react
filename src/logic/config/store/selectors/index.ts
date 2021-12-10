import { createSelector } from 'reselect'

import { AppReduxState } from 'src/store'
import { ChainId } from 'src/config/chain.d'
import { CONFIG_REDUCER_ID } from '../reducer'

export const configState = (state: AppReduxState): { chainId: ChainId } => state[CONFIG_REDUCER_ID]

export const currentChainId = createSelector([configState], (config): ChainId => {
  return config.chainId
})
