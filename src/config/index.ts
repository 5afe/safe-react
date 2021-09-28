import memoize from 'lodash.memoize'
import networks from 'src/config/networks'
import {
  EnvironmentSettings,
  ETHEREUM_NETWORK,
  FEATURES,
  GasPriceOracle,
  NetworkConfig,
  NetworkInfo,
  NetworkSettings,
  SafeFeatures,
  Wallets,
} from 'src/config/networks/network.d'
import {
  APP_ENV,
  ETHERSCAN_API_KEY,
  GOOGLE_ANALYTICS_ID,
  INFURA_TOKEN,
  IS_PRODUCTION,
  NODE_ENV,
  SAFE_APPS_RPC_TOKEN,
} from 'src/utils/constants'
import { sameString } from 'src/utils/strings'

export const getNetworkName = (networkId: ETHEREUM_NETWORK = getNetworkId()): string => {
  const networkNames = Object.keys(ETHEREUM_NETWORK)
  const name = networkNames.find((networkName) => ETHEREUM_NETWORK[networkName] == networkId)
  return name || ''
}

const getNetworkIdFromUrl = () => {
  const DEFAULT_NETWORK = IS_PRODUCTION ? 'MAINNET' : 'RINKEBY'

  const subdirectories = window.location.pathname.split('/')

  const network = Object.values(networks).find(({ network }) => {
    return subdirectories.some((subdirectory) => sameString(network.label, subdirectory))
  })
  const id = network?.network?.id

  return (id ? getNetworkName(id) : DEFAULT_NETWORK).toUpperCase()
}

let networkId = getNetworkIdFromUrl()

export const setNetworkId = (id: string): void => {
  networkId = id
}
export const getNetworkId = (): ETHEREUM_NETWORK => ETHEREUM_NETWORK[networkId]

export const getNetworkConfigById = (id: ETHEREUM_NETWORK): NetworkConfig | undefined => {
  return Object.values(networks).find((cfg) => cfg.network.id === id)
}

export const getNetworkLabel = (id: ETHEREUM_NETWORK = getNetworkId()): string => {
  const cfg = getNetworkConfigById(id)
  return cfg ? cfg.network.label : ''
}

export const usesInfuraRPC = [ETHEREUM_NETWORK.MAINNET, ETHEREUM_NETWORK.RINKEBY, ETHEREUM_NETWORK.POLYGON].includes(
  getNetworkId(),
)

export const getCurrentEnvironment = (): 'test' | 'production' | 'staging' | 'dev' => {
  switch (APP_ENV) {
    case 'test': {
      return 'test'
    }
    case 'production': {
      return APP_ENV === 'production' ? 'production' : 'staging'
    }
    case 'dev':
    default: {
      // We need to check NODE_ENV calling jest outside of scripts
      return NODE_ENV === 'test' ? 'test' : 'dev'
    }
  }
}

export type NetworkSpecificConfiguration = EnvironmentSettings & {
  network: NetworkSettings
  disabledFeatures?: SafeFeatures
  disabledWallets?: Wallets
}

export const getConfig = (): NetworkSpecificConfiguration => {
  const currentEnvironment = getCurrentEnvironment()

  // lookup the config file based on the network specified in the NETWORK variable
  const configFile = networks[getNetworkName().toLowerCase()]
  // defaults to 'production' as it's the only environment that is required for the network configs
  const networkBaseConfig = configFile.environment[currentEnvironment] ?? configFile.environment.production

  return {
    ...networkBaseConfig,
    network: configFile.network,
    disabledFeatures: configFile.disabledFeatures,
    disabledWallets: configFile.disabledWallets,
  }
}

export const getNetworks = (): NetworkInfo[] => {
  const { local, ...usefulNetworks } = networks
  return Object.values(usefulNetworks).map((networkObj) => ({
    id: networkObj.network.id,
    label: networkObj.network.label,
    backgroundColor: networkObj.network.backgroundColor,
    textColor: networkObj.network.textColor,
  }))
}

export const getClientGatewayUrl = (): string => getConfig().clientGatewayUrl

export const getTxServiceUrl = (): string => getConfig().txServiceUrl

export const getGasPrice = (): number | undefined => getConfig()?.gasPrice

export const getGasPriceOracles = (): GasPriceOracle[] | undefined => getConfig()?.gasPriceOracles

const useInfuraRPC = () => {
  return [ETHEREUM_NETWORK.MAINNET, ETHEREUM_NETWORK.RINKEBY, ETHEREUM_NETWORK.POLYGON].includes(getNetworkId())
}

export const getSafeAppsRpcServiceUrl = (): string =>
  useInfuraRPC() ? `${getConfig().safeAppsRpcServiceUrl}/${SAFE_APPS_RPC_TOKEN}` : getConfig().safeAppsRpcServiceUrl

export const getRpcServiceUrl = (): string =>
  useInfuraRPC() ? `${getConfig().rpcServiceUrl}/${INFURA_TOKEN}` : getConfig().rpcServiceUrl

export const getSafeServiceBaseUrl = (safeAddress: string) => `${getTxServiceUrl()}/safes/${safeAddress}`

export const getTokensServiceBaseUrl = () => `${getTxServiceUrl()}/tokens`

/**
 * Checks if a particular feature is enabled in the current network configuration
 * @params {FEATURES} feature
 * @returns boolean
 */
export const isFeatureEnabled = (feature: FEATURES): boolean => {
  const { disabledFeatures } = getConfig()
  return !disabledFeatures?.some((disabledFeature) => disabledFeature === feature)
}

export const getNetworkConfigDisabledWallets = (): Wallets => getConfig()?.disabledWallets || []

export const getNetworkInfo = (): NetworkSettings => getConfig().network

export const getGoogleAnalyticsTrackingID = (): string => GOOGLE_ANALYTICS_ID

const fetchContractABI = memoize(
  async (url: string, contractAddress: string, apiKey?: string) => {
    let params: Record<string, string> = {
      module: 'contract',
      action: 'getAbi',
      address: contractAddress,
    }

    if (apiKey) {
      params = { ...params, apiKey }
    }

    const response = await fetch(`${url}?${new URLSearchParams(params)}`)

    if (!response.ok) {
      return { status: 0, result: [] }
    }

    return response.json()
  },
  (url, contractAddress) => `${url}_${contractAddress}`,
)

const getNetworkExplorerApiKey = (networkExplorerName: string): string | undefined => {
  switch (networkExplorerName.toLowerCase()) {
    case 'etherscan': {
      return ETHERSCAN_API_KEY
    }
    default: {
      return undefined
    }
  }
}

const getNetworkExplorerInfo = (): { name: string; url: string; apiUrl: string } => {
  const cfg = getConfig()
  return {
    name: cfg.networkExplorerName,
    url: cfg.networkExplorerUrl,
    apiUrl: cfg.networkExplorerApiUrl,
  }
}

export const getContractABI = async (contractAddress: string) => {
  const { apiUrl, name } = getNetworkExplorerInfo()

  const apiKey = getNetworkExplorerApiKey(name)

  try {
    const { result, status } = await fetchContractABI(apiUrl, contractAddress, apiKey)

    if (status === '0') {
      return []
    }

    return result
  } catch (e) {
    console.error('Failed to retrieve ABI', e)
    return undefined
  }
}

export type BlockScanInfo = () => {
  alt: string
  url: string
}

export const getExplorerInfo = (hash: string): BlockScanInfo => {
  const { name, url } = getNetworkExplorerInfo()
  const networkInfo = getNetworkInfo()

  switch (networkInfo.id) {
    default: {
      const type = hash.length > 42 ? 'tx' : 'address'
      return () => ({
        url: `${url}/${type}/${hash}`,
        alt: name || '',
      })
    }
  }
}
