import { checksumAddress } from 'src/utils/checksumAddress';
import { ensureOnce } from 'src/utils/singleton'
import { ETHEREUM_NETWORK } from 'src/logic/wallets/getWeb3'
import {
  RELAY_API_URL,
  SIGNATURES_VIA_METAMASK,
  TX_SERVICE_HOST,
  SAFE_APPS_URL
} from 'src/config/names'
import devConfig from './development'
import testConfig from './testing'
import stagingConfig from './staging'
import prodConfig from './production'
import mainnetDevConfig from './development-mainnet'
import mainnetProdConfig from './production-mainnet'
import mainnetStagingConfig from './staging-mainnet'
import { NETWORK } from 'src/utils/constants'
import { NetworkConfig } from './networks/network'
import mainnet from './networks/mainnet'
import rinkeby from './networks/rinkeby'
import xDai from './networks/xdai'

const configuration = () => {
  if (process.env.NODE_ENV === 'test') {
    return testConfig
  }

  if (process.env.NODE_ENV === 'production') {
    if (process.env.REACT_APP_NETWORK === 'mainnet') {
      return process.env.REACT_APP_ENV === 'production'
        ? mainnetProdConfig
        : mainnetStagingConfig
    }

    return process.env.REACT_APP_ENV === 'production'
      ? prodConfig
      : stagingConfig
  }

  return process.env.REACT_APP_NETWORK === 'mainnet'
    ? mainnetDevConfig
    : devConfig
}

export const getNetwork = (): ETHEREUM_NETWORK => ETHEREUM_NETWORK[NETWORK] ?? ETHEREUM_NETWORK.RINKEBY

const getConfig = ensureOnce(configuration)

export const getTxServiceHost = () => {
  const config = getConfig()

  return config[TX_SERVICE_HOST]
}

export const getTxServiceUriFrom = (safeAddress) =>
  `safes/${safeAddress}/transactions/`

export const getIncomingTxServiceUriTo = (safeAddress) =>
  `safes/${safeAddress}/incoming-transfers/`

export const getAllTransactionsUriFrom = (safeAddress: string): string =>
  `safes/${safeAddress}/all-transactions/`

export const getSafeCreationTxUri = (safeAddress) => `safes/${safeAddress}/creation/`

export const getRelayUrl = () => getConfig()[RELAY_API_URL]

export const signaturesViaMetamask = () => {
  const config = getConfig()

  return config[SIGNATURES_VIA_METAMASK]
}

export const getGnosisSafeAppsUrl = () => {
  const config = getConfig()

  return config[SAFE_APPS_URL]
}

export const getGoogleAnalyticsTrackingID = () =>
  getNetwork() === ETHEREUM_NETWORK.MAINNET
    ? process.env.REACT_APP_GOOGLE_ANALYTICS_ID_MAINNET
    : process.env.REACT_APP_GOOGLE_ANALYTICS_ID_RINKEBY

export const getIntercomId = () =>
  process.env.REACT_APP_ENV === 'production'
    ? process.env.REACT_APP_INTERCOM_ID
    : 'plssl1fl'

export const getExchangeRatesUrl = () => 'https://api.exchangeratesapi.io/latest'

export const getExchangeRatesUrlFallback = () => 'https://api.coinbase.com/v2/exchange-rates'

export const getSafeLastVersion = () => process.env.REACT_APP_LATEST_SAFE_VERSION  || '1.1.1'

export const buildSafeCreationTxUrl = (safeAddress) => {
  const host = getTxServiceHost()
  const address = checksumAddress(safeAddress)
  const base = getSafeCreationTxUri(address)

  return `${host}${base}`
}

// @todo (agustin) add missing configs
export const getNetworkConfig = (network: ETHEREUM_NETWORK): NetworkConfig | null => {

  switch(network) {
    case ETHEREUM_NETWORK.MAINNET: {
      return mainnet
    }
    case ETHEREUM_NETWORK.RINKEBY: {
      return rinkeby
    }
    case ETHEREUM_NETWORK.KOVAN: {
      break
    }
    case ETHEREUM_NETWORK.ROPSTEN: {
      break
    }
    case ETHEREUM_NETWORK.GOERLI: {
      break
    }
    case ETHEREUM_NETWORK.ENERGY_WEB_CHAIN: {
      break
    }
    case ETHEREUM_NETWORK.MORDEN: {
      break
    }
    case ETHEREUM_NETWORK.VOLTA: {
      break
    }
    case ETHEREUM_NETWORK.XDAI: {
      return xDai
    }
    case ETHEREUM_NETWORK.UNKNOWN: {
      break
    }
  }

  return null
}
