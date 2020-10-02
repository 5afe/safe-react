import networks from 'src/config/networks'
import { EnvironmentSettings, NetworkConfig, NetworkSettings, SafeFeatures } from 'src/config/networks/network'
import { ETHEREUM_NETWORK } from 'src/logic/wallets/getWeb3'
import { checksumAddress } from 'src/utils/checksumAddress'
import { GOOGLE_ANALYTICS_ID, NETWORK } from 'src/utils/constants'
import { ensureOnce } from 'src/utils/singleton'

export const getNetworkId = (): ETHEREUM_NETWORK => ETHEREUM_NETWORK[NETWORK] ?? ETHEREUM_NETWORK.RINKEBY

export const getNetworkName = (): string => ETHEREUM_NETWORK[getNetworkId()]

type NetworkSpecificConfiguration = EnvironmentSettings & {
  network: NetworkSettings,
  features: SafeFeatures,
}

const configuration = (): Promise<NetworkSpecificConfiguration> => {
  const configFile: NetworkConfig = networks[getNetworkName().toLowerCase()]

  return {
    ...configFile.environment[process.env.REACT_APP_ENV ?? 'production'],
    network: configFile.network,
    features: configFile.features,
  }
}

const getConfig: () => NetworkSpecificConfiguration = ensureOnce(configuration)

export const getTxServiceHost = (): string => getConfig()?.txServiceUrl

export const getRelayUrl = (): string | undefined => getConfig()?.relayApiUrl

export const getGnosisSafeAppsUrl = (): string => getConfig()?.safeAppsUrl

export const getTxServiceUriFrom = (safeAddress) => `safes/${safeAddress}/transactions/`

export const getIncomingTxServiceUriTo = (safeAddress: string) => `safes/${safeAddress}/incoming-transfers/`

export const getAllTransactionsUriFrom = (safeAddress: string) => `safes/${safeAddress}/all-transactions/`

export const getSafeCreationTxUri = (safeAddress: string) => `safes/${safeAddress}/creation/`

export const getGoogleAnalyticsTrackingID = (): string => GOOGLE_ANALYTICS_ID[getNetworkName()]

export const buildSafeCreationTxUrl = (safeAddress) => {
  const host = getTxServiceHost()
  const address = checksumAddress(safeAddress)
  const base = getSafeCreationTxUri(address)

  return `${host}${base}`
}
