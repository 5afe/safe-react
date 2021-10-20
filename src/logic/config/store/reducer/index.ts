import { Action, handleActions } from 'redux-actions'

import { AppReduxState } from 'src/store'
import { CONFIG_ACTIONS } from 'src/logic/config/store/actions'
import { makeNetworkConfig, NetworkState } from 'src/logic/config/model/networkConfig'
import { getConfig } from 'src/config'

export const NETWORK_CONFIG_REDUCER_ID = 'networkConfig'

type Payload = NetworkState | string

export default handleActions<AppReduxState['networkConfig'], Payload>(
  {
    [CONFIG_ACTIONS.CONFIG_STORE]: (state, action: Action<NetworkState>) => {
      return { ...state, ...action.payload }
    },
  },
  makeNetworkConfig(getConfig()),
)
