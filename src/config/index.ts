import memoize from 'lodash.memoize'

import networks from 'src/config/networks'
import { EnvironmentSettings, ETHEREUM_NETWORK, NetworkSettings, SafeFeatures, Wallets, GasPriceOracle } from 'src/config/networks/network.d'
import { APP_ENV, ETHERSCAN_API_KEY, GOOGLE_ANALYTICS_ID, INFURA_TOKEN, NETWORK, NODE_ENV } from 'src/utils/constants'
import { ensureOnce } from 'src/utils/singleton'

export const getNetworkId = (): ETHEREUM_NETWORK => ETHEREUM_NETWORK[NETWORK]

export const getNetworkName = (): string => ETHEREUM_NETWORK[getNetworkId()]

const getCurrentEnvironment = (): string => {
  switch (NODE_ENV) {
    case 'test': {
      return 'test'
    }
    case 'production': {
      return APP_ENV === 'production' ? 'production' : 'staging'
    }
    default: {
      return 'dev'
    }
  }
}

type NetworkSpecificConfiguration = EnvironmentSettings & {
  network: NetworkSettings,
  disabledFeatures?: SafeFeatures,
  disabledWallets?: Wallets,
}

const configuration = (): NetworkSpecificConfiguration => {
  const currentEnvironment = getCurrentEnvironment()

  // special case for test environment
  if (currentEnvironment === 'test') {
    const configFile = networks.local

    return {
      ...configFile.environment.production,
      network: configFile.network,
      disabledFeatures: configFile.disabledFeatures,
    }
  }

  // lookup the config file based on the network specified in the NETWORK variable
  const configFile = networks[getNetworkName().toLowerCase()]
  // defaults to 'production' as it's the only environment that is required for the network configs
  const networkBaseConfig = configFile.environment[currentEnvironment] ?? configFile.environment.production

  return {
    ...networkBaseConfig,
    network: configFile.network,
    disabledFeatures: configFile.disabledFeatures,
    disabledWallets: configFile.disabledWallets
  }
}

const getConfig: () => NetworkSpecificConfiguration = ensureOnce(configuration)

export const getTxServiceUrl = (): string => getConfig().txServiceUrl

export const getRelayUrl = (): string | undefined => getConfig().relayApiUrl

export const getGnosisSafeAppsUrl = (): string => getConfig().safeAppsUrl

export const getGasPrice = (): number | undefined => getConfig()?.gasPrice

export const getGasPriceOracle = (): GasPriceOracle | undefined => getConfig()?.gasPriceOracle

export const getRpcServiceUrl = (): string => {
  const usesInfuraRPC = [ETHEREUM_NETWORK.MAINNET, ETHEREUM_NETWORK.RINKEBY].includes(getNetworkId())

  if (usesInfuraRPC) {
    return `${getConfig().rpcServiceUrl}/${INFURA_TOKEN}`
  }

  return getConfig().rpcServiceUrl
}

export const getSafeServiceBaseUrl = (safeAddress: string) => `${getTxServiceUrl()}/safes/${safeAddress}`

export const getTokensServiceBaseUrl = () => `${getTxServiceUrl()}/tokens`

export const getNetworkExplorerInfo = (): { name: string; url: string; apiUrl: string } => ({
  name: getConfig().networkExplorerName,
  url: getConfig().networkExplorerUrl,
  apiUrl: getConfig().networkExplorerApiUrl,
})

export const getNetworkConfigDisabledFeatures = (): SafeFeatures => getConfig().disabledFeatures || []

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

const getNetworkExplorerApiKey = (networkExplorerName: string): string | undefined=> {
  switch (networkExplorerName.toLowerCase()) {
    case 'etherscan': {
      return  ETHERSCAN_API_KEY
    }
    default: {
      return undefined
    }
  }
}

export const getContractABI = async (contractAddress: string)  =>{
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
        alt:  name || '',
      })
    }
  }
}
