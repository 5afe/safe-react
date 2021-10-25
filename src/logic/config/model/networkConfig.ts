import { ETHEREUM_NETWORK } from 'src/config/networks/network.d'

import { NetworkSpecificConfiguration } from 'src/config'

type GasPriceOracle = {
  type: string
  uri: string
  gasParameter: string
  gweiFactor: string
}

export type NativeCurrency = {
  name: string
  symbol: string
  decimals: number
  logoUri?: string
}

export type NetworkConfig = {
  chainId: ETHEREUM_NETWORK
  chainName: string
  rpcUri: {
    authentication: string
    value: string
  }
  safeAppsRpcUri: {
    authentication: string
    value: string
  }
  blockExplorerUriTemplate: {
    address: string
    txHash: string
  }
  nativeCurrency: NativeCurrency
  transactionService: string
  theme: {
    textColor: string
    backgroundColor: string
  }
  gasPrice: GasPriceOracle
  ensRegistryAddress: string
  recommendedMasterCopyVersion: string
}

// We start from small to bigger. First having less values in storage
export type NetworkState = {
  chainId: ETHEREUM_NETWORK
  chainName: string
  nativeCurrency: NativeCurrency
  theme?: {
    textColor: string
    backgroundColor: string
  }
}

export const makeNetworkConfig = (config: NetworkSpecificConfiguration): NetworkState => {
  const { network } = config
  return {
    chainId: network.id,
    chainName: network.label,
    nativeCurrency: { ...network.nativeCoin },
    theme: {
      textColor: network.textColor,
      backgroundColor: network.backgroundColor,
    },
  }
}
