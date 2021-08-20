import { Dispatch } from 'redux'
import { createAction } from 'redux-actions'

import { getConfig, getNetworkId, NetworkSpecificConfiguration } from 'src/config'
import { ETHEREUM_NETWORK } from 'src/config/networks/network.d'

// following the suggested naming convention at
// https://redux.js.org/style-guide/style-guide#write-action-types-as-domaineventname
export enum CONFIG_ACTIONS {
  CONFIG_LOADED = 'config/loaded',
  CONFIG_STORE = 'config/store',
  CONFIG_SET_CHAIN_ID = 'config/setChainId',
}

export const configStore = createAction<NetworkSpecificConfiguration>(CONFIG_ACTIONS.CONFIG_STORE)
export const configSetChainId = createAction<ETHEREUM_NETWORK>(CONFIG_ACTIONS.CONFIG_SET_CHAIN_ID)

export const loadConfig = async (dispatch: Dispatch): Promise<void> => {
  try {
    // const safeConfigService = await fetchSafeConfig('4')
    const chainId = getNetworkId()
    console.log(chainId)
    const safeConfig = getConfig()
    //  console.log(safeConfigService)
    console.log(safeConfig)
    dispatch(configStore(safeConfig))
  } catch (err) {
    // eslint-disable-next-line
    console.error('Error while getting network configuration:', err)
  }
}
