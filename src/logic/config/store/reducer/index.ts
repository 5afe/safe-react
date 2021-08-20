import { Action, handleActions } from 'redux-actions'

import { AppReduxState } from 'src/store'
import { CONFIG_ACTIONS } from 'src/logic/config/store/actions'
import { makeNetworkConfigFromSpecificConfiguration, NetworkState } from 'src/logic/config/model/networkConfig'
import { getConfig, getNetworkId, getNetworkName, NetworkSpecificConfiguration, setNetworkId } from 'src/config'
import { ETHEREUM_NETWORK } from 'src/config/networks/network.d'

export const NETWORK_CONFIG_REDUCER_ID = 'networkConfig'

type Payload = NetworkState | NetworkSpecificConfiguration | string

export default handleActions<AppReduxState['networkConfig'], Payload>(
  {
    [CONFIG_ACTIONS.CONFIG_STORE]: (state, action: Action<NetworkSpecificConfiguration>) => {
      const prevState = { ...state }
      const newParams = makeNetworkConfigFromSpecificConfiguration(action.payload)
      return { ...prevState, ...newParams }
    },
    [CONFIG_ACTIONS.CONFIG_SET_CHAIN_ID]: (state, action: Action<string>) => {
      const prevState = { ...state }
      setNetworkId(getNetworkName(action.payload as ETHEREUM_NETWORK))
      const safeConfig = makeNetworkConfigFromSpecificConfiguration(getConfig())
      return { ...prevState, ...safeConfig }
    },
  },
  {
    chainId: getNetworkId(),
    chainName: '',
  },
)
