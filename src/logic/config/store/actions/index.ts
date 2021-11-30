import { createAction } from 'redux-actions'

import { ChainId, _getChainId } from 'src/config'

export enum CONFIG_ACTIONS {
  SET_CHAIN_ID = 'config/setChainId',
}

export const setChainIdAction = createAction<ChainId>(CONFIG_ACTIONS.SET_CHAIN_ID)
