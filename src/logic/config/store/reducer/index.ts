import { handleActions } from 'redux-actions'
import { ChainId } from 'src/config/chain.d'

import { DEFAULT_CHAIN_ID } from 'src/utils/constants'
import { CONFIG_ACTIONS } from '../actions'

export const CONFIG_REDUCER_ID = 'config'

export type ConfigState = {
  chainId: ChainId
}

export const initialConfigState: ConfigState = {
  chainId: DEFAULT_CHAIN_ID,
}

export type ConfigPayload = ChainId

// Stored locally as to preserve chainId for non-EIP-3770 routes
const configReducer = handleActions<ConfigState, ConfigPayload>(
  {
    [CONFIG_ACTIONS.SET_CHAIN_ID]: (state, action) => {
      const networkId = action.payload
      return { ...state, chainId: networkId }
    },
  },
  initialConfigState,
)

export default configReducer
