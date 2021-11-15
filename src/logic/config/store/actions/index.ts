import { ChainListResponse, getChainsConfig } from '@gnosis.pm/safe-react-gateway-sdk'
import { Dispatch } from 'redux'
import { createAction } from 'redux-actions'
import { ETHEREUM_NETWORK } from 'src/types/network.d'

import { CONFIG_SERVICE_URL } from 'src/utils/constants'

// following the suggested naming convention at
// https://redux.js.org/style-guide/style-guide#write-action-types-as-domaineventname
export enum CONFIG_ACTIONS {
  SET_NETWORK_ID = 'config/setNetworkId',
  LOAD_CHAINS = 'config/loadChains',
}

export const setNetworkId = createAction<ETHEREUM_NETWORK>(CONFIG_ACTIONS.SET_NETWORK_ID)

export const loadChains = createAction<ChainListResponse>(CONFIG_ACTIONS.LOAD_CHAINS)

export const loadConfig =
  () =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      const chains = await getChainsConfig(CONFIG_SERVICE_URL)
      dispatch(loadChains(chains))
    } catch (err) {
      // TODO: Error handling
    }
  }
