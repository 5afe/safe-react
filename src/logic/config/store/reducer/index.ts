import { handleActions } from 'redux-actions'
import { LOCAL_CONFIG_KEY, _getChainId } from 'src/config'
import { ChainId } from 'src/config/chain.d'
import { CONFIG_ACTIONS } from '../actions'

export const CONFIG_REDUCER_ID = LOCAL_CONFIG_KEY

export type ConfigState = {
  chainId: ChainId
}

export const initialConfigState: ConfigState = {
  chainId: _getChainId(),
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
