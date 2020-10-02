import networks from 'src/config/networks'
import { EnvironmentSettings, NetworkConfig, NetworkSettings, SafeFeatures } from 'src/config/networks/network'
import { ETHEREUM_NETWORK } from 'src/logic/wallets/getWeb3'
import { checksumAddress } from 'src/utils/checksumAddress'
import { GOOGLE_ANALYTICS_ID, NETWORK } from 'src/utils/constants'
import { ensureOnce } from 'src/utils/singleton'

export const getNetworkId = (): ETHEREUM_NETWORK => ETHEREUM_NETWORK[NETWORK] ?? ETHEREUM_NETWORK.RINKEBY

type NetworkSpecificConfiguration = EnvironmentSettings & {
  network: NetworkSettings,
  features: SafeFeatures,
}

const configuration = (): Promise<NetworkSpecificConfiguration> => {
  const configFile: NetworkConfig = networks[ETHEREUM_NETWORK[getNetworkId()].toLowerCase()]

  return {
    ...configFile.environment[process.env.REACT_APP_ENV ?? 'production'],
    network: configFile.network,
    features: configFile.features,
  }
}

const getConfig: () => NetworkSpecificConfiguration = ensureOnce(configuration)

export const getTxServiceHost = (): string => {
  const config = getConfig()
  return config.txServiceUri
}

export const getRelayUrl = (): string | undefined => {
  const config = getConfig()
  return config.relayApiUri
}

export const getGnosisSafeAppsUrl = (): string => {
  const config = getConfig()
  return config.safeAppsUri
}

export const getTxServiceUriFrom = (safeAddress) =>
  `safes/${safeAddress}/transactions/`

export const getIncomingTxServiceUriTo = (safeAddress) =>
  `safes/${safeAddress}/incoming-transfers/`

export const getAllTransactionsUriFrom = (safeAddress: string): string =>
  `safes/${safeAddress}/all-transactions/`

export const getSafeCreationTxUri = (safeAddress) => `safes/${safeAddress}/creation/`

export const getGoogleAnalyticsTrackingID = () => GOOGLE_ANALYTICS_ID[ETHEREUM_NETWORK[getNetwork()]]

// TODO: replace this with an `INTERCOM_ID` constant?
export const getIntercomId = () =>
  process.env.REACT_APP_ENV === 'production'
    ? process.env.REACT_APP_INTERCOM_ID
    : 'plssl1fl'

// TODO: handle this within one function? or expose both urls in respective constants?
//  `EXCHANGE_RATE_URI`, `EXCHANGE_RATES_URI_FALLBACK`
export const getExchangeRatesUrl = () => 'https://api.exchangeratesapi.io/latest'
export const getExchangeRatesUrlFallback = () => 'https://api.coinbase.com/v2/exchange-rates'

// TODO: This can be exposed directly in the `constants.ts` file
export const getSafeLastVersion = () => process.env.REACT_APP_LATEST_SAFE_VERSION  || '1.1.1'

export const buildSafeCreationTxUrl = (safeAddress) => {
  const host = getTxServiceHost()
  const address = checksumAddress(safeAddress)
  const base = getSafeCreationTxUri(address)

  return `${host}${base}`
}
