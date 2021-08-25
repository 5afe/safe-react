import { Dispatch } from 'redux'
import { createAction } from 'redux-actions'

import { getConfig } from 'src/config'
import { ETHEREUM_NETWORK } from 'src/config/networks/network.d'
import { makeNetworkConfig, NetworkState } from 'src/logic/config/model/networkConfig'

// following the suggested naming convention at
// https://redux.js.org/style-guide/style-guide#write-action-types-as-domaineventname
export enum CONFIG_ACTIONS {
  CONFIG_STORE = 'config/store',
}

export const configStore = createAction<NetworkState>(CONFIG_ACTIONS.CONFIG_STORE)

export const loadConfig = async (dispatch: Dispatch): Promise<void> => {
  try {
    // FIXME when changing to the config service we should start using this function
    // instead of fetching from static files configuration
    // Currently we don't need to call anything here because we have default init with static files config in src/logic/config/store/reducer
    // const chainId = getNetworkId()
    // const safeConfigService = await fetchSafeConfig(chainId)
    // const safeConfig = getConfig()
    // dispatch(configStore(makeNetworkConfig(safeConfig)))
  } catch (err) {
    console.error('Error while getting network configuration:', err)
  }
}
