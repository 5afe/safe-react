import { ChainListResponse } from '@gnosis.pm/safe-react-gateway-sdk'
import { handleActions } from 'redux-actions'

import { ChainId } from 'src/config'
import { DEFAULT_CHAIN_ID } from 'src/utils/constants'
import { CONFIG_ACTIONS } from '../actions'

export const CONFIG_REDUCER_ID = 'config'

export type ConfigState = {
  chainId: ChainId
}

const initialConfigState: ConfigState = {
  chainId: DEFAULT_CHAIN_ID,
}

export type ConfigPayload = ChainId

export const _chains: Pick<ChainListResponse, 'next' | 'results'> = {
  next: '',
  results: [],
}

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
