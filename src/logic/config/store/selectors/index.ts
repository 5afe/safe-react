import { createSelector } from 'reselect'

import { AppReduxState } from 'src/store'
import { ChainId } from 'src/config/chain.d'
import { CONFIG_REDUCER_ID } from '../reducer'
import { ConfigState } from '../reducer/reducer.d'

export const configState = (state: AppReduxState): ConfigState => state[CONFIG_REDUCER_ID]

export const currentChainId = createSelector([configState], (config): ChainId => {
  return config.chainId
})
