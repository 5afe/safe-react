import { createAction } from 'redux-actions'

import { ChainId } from 'src/config'

export enum CONFIG_ACTIONS {
  SET_CHAIN_ID = 'SET_CHAIN_ID',
}

export const setChainId = createAction<ChainId>(CONFIG_ACTIONS.SET_CHAIN_ID)
