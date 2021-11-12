import { ChainInfo, getChainsConfig } from '@gnosis.pm/safe-react-gateway-sdk'
import { Dispatch } from 'redux'
import { createAction } from 'redux-actions'

import { getNetworkId, getNetworks } from 'src/config'
import { makeNetworkConfig, NetworkConfig } from 'src/logic/config/model/networkConfig'
import { CONFIG_SERVICE_URL } from 'src/utils/constants'

// following the suggested naming convention at
// https://redux.js.org/style-guide/style-guide#write-action-types-as-domaineventname
export enum CONFIG_ACTIONS {
  CONFIGURE_STORE = 'config/configureStore',
}

export const configureStore = createAction<NetworkConfig>(CONFIG_ACTIONS.CONFIGURE_STORE)

export const CHAIN_CONFIG_KEY = 'SAFE__chainConfig'
const fetchChainConfigs = async (baseUrl = CONFIG_SERVICE_URL): Promise<ChainInfo[]> => {
  let { next, results } = await getChainsConfig(baseUrl)

  if (next) {
    results = [...results, ...(await fetchChainConfigs(next))]
  }

  return results
}

export const loadConfig =
  () =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      const chains = getNetworks() || (await fetchChainConfigs())
      const config = chains.find(({ chainId }) => chainId === getNetworkId())

      if (!config) {
        throw new Error(`No config found for network ${getNetworkId()}`)
      }

      dispatch(configureStore(makeNetworkConfig(config)))
    } catch (err) {
      // TODO: Error handling
    }
  }
