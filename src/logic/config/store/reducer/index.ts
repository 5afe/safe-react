import { Action, handleActions } from 'redux-actions'

import { AppReduxState } from 'src/store'
import { CONFIG_ACTIONS } from 'src/logic/config/store/actions'
import { makeNetworkConfig, NetworkState } from 'src/logic/config/model/networkConfig'
import { getConfig, getNetworkName, setNetworkId } from 'src/config'
import { ETHEREUM_NETWORK } from 'src/config/networks/network.d'

export const NETWORK_CONFIG_REDUCER_ID = 'networkConfig'

type Payload = NetworkState | string

export default handleActions<AppReduxState['networkConfig'], Payload>(
  {
    [CONFIG_ACTIONS.CONFIG_STORE]: (state, action: Action<NetworkState>) => {
      return { ...state, ...action.payload }
    },
    [CONFIG_ACTIONS.CONFIG_SET_CHAIN_ID]: (state, action: Action<string>) => {
      const prevState = { ...state }
      setNetworkId(getNetworkName(action.payload as ETHEREUM_NETWORK))
      const safeConfig = makeNetworkConfig(getConfig())
      return { ...prevState, ...safeConfig }
    },
  },
  makeNetworkConfig(getConfig()),
)
