import { createAction } from 'redux-actions'

import { _getChainId } from 'src/config'
import { ChainId } from 'src/config/chain.d'

export enum CONFIG_ACTIONS {
  SET_CHAIN_ID = 'config/setChainId',
}

export const setChainIdAction = createAction<ChainId>(CONFIG_ACTIONS.SET_CHAIN_ID)
