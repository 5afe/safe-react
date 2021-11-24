import { Action, handleActions } from 'redux-actions'

import { CONFIG_ACTIONS } from 'src/logic/config/store/actions'
import { ETHEREUM_NETWORK } from 'src/types/network.d'
import { ChainListResponse } from '@gnosis.pm/safe-react-gateway-sdk'
import { DEFAULT_NETWORK } from 'src/utils/constants'
import { extractShortName } from 'src/routes/routes'

export const NETWORK_CONFIG_REDUCER_ID = 'networkConfig'

export type ConfigState = {
  networkId: ETHEREUM_NETWORK
  chains: ChainListResponse
}

const initialState: ConfigState = {
  networkId: DEFAULT_NETWORK,
  chains: { next: null, previous: null, results: [] },
}

type Payloads = ChainListResponse | ETHEREUM_NETWORK

const configReducer = handleActions<ConfigState, Payloads>(
  {
    [CONFIG_ACTIONS.SET_NETWORK_ID]: (state, action: Action<ETHEREUM_NETWORK>) => {
      const hasNetworkConfig = state.chains.results?.some(({ chainId }) => chainId === action.payload)

      if (hasNetworkConfig) {
        return {
          ...state,
          networkId: action.payload,
        }
      }

      if (state.chains.next) {
        // Not necessary atm, but load the next page of chains and check if id is found, else load again
      }

      return { ...state, networkId: action.payload }
    },
    [CONFIG_ACTIONS.LOAD_CHAINS]: (state, action: Action<ChainListResponse>) => {
      const networkIdInUrl = action.payload.results?.find(({ chainId }) => chainId === extractShortName())?.chainId

      const networkId = networkIdInUrl ?? state.networkId

      return {
        ...state,
        networkId,
        chains: action.payload,
      }
    },
  },
  initialState,
)

export default configReducer
