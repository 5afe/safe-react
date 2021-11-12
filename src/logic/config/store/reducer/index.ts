import { Action, handleActions } from 'redux-actions'

import { AppReduxState } from 'src/store'
import { CONFIG_ACTIONS } from 'src/logic/config/store/actions'
import { makeNetworkConfig, NetworkConfig } from 'src/logic/config/model/networkConfig'
import { getChainInfo } from 'src/config'

export const NETWORK_CONFIG_REDUCER_ID = 'networkConfig'

export default handleActions<AppReduxState['networkConfig'], NetworkConfig>(
  {
    [CONFIG_ACTIONS.CONFIGURE_STORE]: (state, action: Action<NetworkConfig>) => {
      return { ...state, ...action.payload }
    },
  },
  makeNetworkConfig(getChainInfo()),
)
