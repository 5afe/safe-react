import { ChainInfo, FEATURES, GasPriceOracle, GAS_PRICE_TYPE } from '@gnosis.pm/safe-react-gateway-sdk'
import { createSelector } from 'reselect'

import { ETHEREUM_NETWORK, NETWORK_ID } from 'src/types/network.d'
import { AppReduxState } from 'src/store'
import { INFURA_TOKEN } from 'src/utils/constants'
import { ConfigState, NETWORK_CONFIG_REDUCER_ID } from '../reducer'

export const networkConfigState = (state: AppReduxState): ConfigState => state[NETWORK_CONFIG_REDUCER_ID]

export const currentNetworks = createSelector(
  [networkConfigState],
  (networks): ConfigState['chains']['results'] => networks.chains.results,
)

export const currentNetworkId = createSelector([networkConfigState], (configState): ConfigState['networkId'] => {
  return configState.networkId
})

type NetworkConfig = ConfigState['chains']['results'][number]

const findNetworkById = (configState: ConfigState, networkId: string): NetworkConfig => {
  return configState.chains.results.find(({ chainId }) => chainId === networkId)!
}

export const currentNetwork = createSelector([networkConfigState, currentNetworkId], findNetworkById)

export const getNetworkById = createSelector(
  [networkConfigState, (_: AppReduxState, networkId: string): string => networkId],
  findNetworkById,
)

export const currentNetworkName = createSelector([currentNetwork], (networkConfig): NetworkConfig['chainName'] => {
  return networkConfig.chainName
})

export const currentShortName = createSelector([currentNetwork], (networkConfig): NetworkConfig['shortName'] => {
  return networkConfig.shortName
})

export const getNetworkByShortName = createSelector(
  [networkConfigState, (_: AppReduxState['networkConfig'], shortName: ETHEREUM_NETWORK): string => shortName],
  (networkConfig, shortName): NetworkConfig => {
    return networkConfig.chains.results.find((network) => network.shortName === shortName)!
  },
)

export const currentGasPriceOracles = createSelector(
  [currentNetwork],
  (networkConfig): Extract<NetworkConfig['gasPrice'][number], GasPriceOracle>[] => {
    const isOracleType = (gasPrice: ChainInfo['gasPrice'][number]): gasPrice is GasPriceOracle =>
      gasPrice.type === GAS_PRICE_TYPE.ORACLE

    return networkConfig.gasPrice.filter(isOracleType)
  },
)

// FIXME: Not sure if this is correct. We had a fixed gasPrice value before
export const currentGasPrice = createSelector([currentGasPriceOracles], (oracles): string => {
  return oracles[0].gweiFactor || ''
})

export const currentTxServiceUrl = createSelector(
  [currentNetwork],
  (networkConfig): NetworkConfig['transactionService'] => {
    return networkConfig.transactionService
  },
)

export const currentTokensServiceBaseUrl = createSelector([currentTxServiceUrl], (transactionService): string => {
  return `${transactionService}/tokens`
})

const getTokenizedRpcUrl = (chainId: NetworkConfig['chainId'], url: NetworkConfig['rpcUri']['value']): string => {
  const usesInfuraRPC = [NETWORK_ID.MAINNET, NETWORK_ID.RINKEBY, NETWORK_ID.POLYGON].includes(chainId as NETWORK_ID)
  return usesInfuraRPC ? `${url}/${INFURA_TOKEN}` : url
}

export const currentRpcServiceUrl = createSelector(
  [currentNetwork],
  (networkConfig): NetworkConfig['rpcUri']['value'] => {
    return getTokenizedRpcUrl(networkConfig.chainId, networkConfig.rpcUri.value)
  },
)

export const currentSafeAppsRpcServiceUrl = createSelector(
  [currentNetwork],
  //@ts-ignore TODO: Remove when SDK updated
  (networkConfig): NetworkConfig['safeAppsRpcUri']['value'] => {
    return getTokenizedRpcUrl(networkConfig.chainId, networkConfig.rpcUri.value)
  },
)

// TODO: When migrating to v2 /chains, we can use to select the CLIENT, PUBLIC, SAFE_APPS RPC urls
// export const currentRpcServiceUrlByType = createSelector(
//   [currentNetwork, (_: AppReduxState, type: RPC_TYPE): RPC_TYPE => type],
//   (networkConfig, type): NetworkConfig['rpcUri']['value'] => {
//     const url = networkConfig.rpcs.find((rpc) => rpc.type === type)!.value
//     const usesInfuraRPC = [NETWORK_ID.MAINNET, NETWORK_ID.RINKEBY, NETWORK_ID.POLYGON].includes(
//       networkConfig.chainId as NETWORK_ID,
//     )
//     return usesInfuraRPC ? `${url}/${INFURA_TOKEN}` : url
//   },
// )

export const currentSafeServiceBaseUrl = createSelector(
  [currentTxServiceUrl, (_: AppReduxState, safeAddress: string): string => safeAddress],
  (transactionService, safeAddress): string => {
    return `${transactionService}/safes/${safeAddress}`
  },
)

export const currentDisabledWallets = createSelector(
  [currentNetwork],
  (networkConfig): NetworkConfig['disabledWallets'] => {
    return networkConfig.disabledWallets
  },
)

export const currentExporerUriTemplate = createSelector(
  [currentNetwork],
  (networkConfig): NetworkConfig['blockExplorerUriTemplate'] => {
    return networkConfig.blockExplorerUriTemplate
  },
)

export const currentExplorerUrl = createSelector([currentExporerUriTemplate], (explorerUriTemplate): string => {
  const { origin } = new URL(explorerUriTemplate.address)
  return origin
})

export const currentBlockExplorerInfo = createSelector(
  [currentExporerUriTemplate, (_: AppReduxState, hash: string): string => hash],
  (explorerUriTemplate, hash): string => {
    const { txHash, address } = explorerUriTemplate
    const isTx = hash.length > 42

    return isTx ? txHash.replace('{{hash}}', hash) : address.replace('{{address}}', hash)
  },
)

export const isFeatureEnabled = createSelector(
  [currentNetwork, (_: AppReduxState, feature: FEATURES): FEATURES => feature],
  (networkConfig, feature): boolean => {
    return networkConfig.features.includes(feature)
  },
)
