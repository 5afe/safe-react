import networks from 'src/config/networks'
import {
  EnvironmentSettings,
  ETHEREUM_NETWORK,
  NetworkSettings,
  SafeFeatures,
} from 'src/config/networks/network'
import { checksumAddress } from 'src/utils/checksumAddress'
import { GOOGLE_ANALYTICS_ID, NETWORK, APP_ENV, NODE_ENV } from 'src/utils/constants'
import { ensureOnce } from 'src/utils/singleton'

export const getNetworkId = (): ETHEREUM_NETWORK => ETHEREUM_NETWORK[NETWORK]

export const getNetworkName = (): string => ETHEREUM_NETWORK[getNetworkId()]

const getCurrentEnvironment = (): string => {
  if (NODE_ENV === 'test') {
    return 'test'
  }

  if (NODE_ENV === 'production') {
    if (APP_ENV === 'production') {
      return 'production'
    } else {
      return 'staging'
    }
  }

  return 'dev'
}

type NetworkSpecificConfiguration = EnvironmentSettings & {
  network: NetworkSettings,
  features?: SafeFeatures,
}

const configuration = (): NetworkSpecificConfiguration => {
  const currentEnvironment = getCurrentEnvironment()

  // special case for test environment
  if (currentEnvironment === 'test') {
    const configFile = networks.local

    return {
      ...configFile.environment.production,
      network: configFile.network,
      features: configFile.features,
    }
  }

  // lookup the config file based on the network specified in the NETWORK variable
  const configFile = networks[getNetworkName().toLowerCase()]
  // defaults to 'production' as it's the only environment that is required for the network configs
  const networkBaseConfig = configFile.environment[currentEnvironment] ?? configFile.environment.production

  return {
    ...networkBaseConfig,
    network: configFile.network,
    features: configFile.features,
  }
}

const getConfig: () => NetworkSpecificConfiguration = ensureOnce(configuration)

export const getTxServiceUrl = (): string => getConfig()?.txServiceUrl

export const getRelayUrl = (): string | undefined => getConfig()?.relayApiUrl

export const getGnosisSafeAppsUrl = (): string => getConfig()?.safeAppsUrl

export const getRpcServiceUrl = (): string => getConfig()?.rpcServiceUrl

export const getNetworkExplorerInfo = (): { name: string; url: string; apiUrl: string } => ({
  name: getConfig()?.networkExplorerName,
  url: getConfig()?.networkExplorerUrl,
  apiUrl: getConfig()?.networkExplorerApiUrl,
})

export const getNetworkConfigFeatures = (): SafeFeatures | undefined => getConfig()?.features

export const getNetworkInfo = (): NetworkSettings => getConfig()?.network

export const getTxServiceUriFrom = (safeAddress: string) => `safes/${safeAddress}/transactions/`

export const getIncomingTxServiceUriTo = (safeAddress: string) => `safes/${safeAddress}/incoming-transfers/`

export const getAllTransactionsUriFrom = (safeAddress: string) => `safes/${safeAddress}/all-transactions/`

export const getSafeCreationTxUri = (safeAddress: string) => `safes/${safeAddress}/creation/`

export const getGoogleAnalyticsTrackingID = (): string => GOOGLE_ANALYTICS_ID[getNetworkName()]

export const buildSafeCreationTxUrl = (safeAddress: string) => {
  const host = getTxServiceUrl()
  const address = checksumAddress(safeAddress)
  const base = getSafeCreationTxUri(address)

  return `${host}${base}`
}
