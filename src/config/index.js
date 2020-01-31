// @flow
import { ensureOnce } from "~/utils/singleton"
import { ETHEREUM_NETWORK } from "~/logic/wallets/getWeb3"
import {
  RELAY_API_URL,
  SIGNATURES_VIA_METAMASK,
  TX_SERVICE_HOST
} from "~/config/names"
import devConfig from "./development"
import testConfig from "./testing"
import stagingConfig from "./staging"
import prodConfig from "./production"
import mainnetDevConfig from "./development-mainnet"
import mainnetProdConfig from "./production-mainnet"
import mainnetStagingConfig from "./staging-mainnet"

const configuration = () => {
  if (process.env.NODE_ENV === "test") {
    return testConfig
  }

  if (process.env.NODE_ENV === "production") {
    if (process.env.REACT_APP_NETWORK === "mainnet") {
      return process.env.REACT_APP_ENV === "production"
        ? mainnetProdConfig
        : mainnetStagingConfig
    }

    return process.env.REACT_APP_ENV === "production"
      ? prodConfig
      : stagingConfig
  }

  return process.env.REACT_APP_NETWORK === "mainnet"
    ? mainnetDevConfig
    : devConfig
}

export const getNetwork = () =>
  process.env.REACT_APP_NETWORK === "mainnet"
    ? ETHEREUM_NETWORK.MAINNET
    : ETHEREUM_NETWORK.RINKEBY

export const getNetworkId = () =>
  process.env.REACT_APP_NETWORK === "mainnet" ? 1 : 4

const getConfig = ensureOnce(configuration)

export const getTxServiceHost = () => {
  const config = getConfig()

  return config[TX_SERVICE_HOST]
}

export const getTxServiceUriFrom = (safeAddress: string) =>
  `safes/${safeAddress}/transactions/`

export const getIncomingTxServiceUriTo = (safeAddress: string) =>
  `safes/${safeAddress}/incoming-transactions/`

export const getRelayUrl = () => getConfig()[RELAY_API_URL]

export const signaturesViaMetamask = () => {
  const config = getConfig()

  return config[SIGNATURES_VIA_METAMASK]
}

export const getGoogleAnalyticsTrackingID = () =>
  getNetwork() === ETHEREUM_NETWORK.MAINNET
    ? process.env.REACT_APP_GOOGLE_ANALYTICS_ID_MAINNET
    : process.env.REACT_APP_GOOGLE_ANALYTICS_ID_RINKEBY

export const getIntercomId = () =>
  process.env.REACT_APP_ENV === "production"
    ? process.env.REACT_APP_INTERCOM_ID
    : "plssl1fl"

export const getExchangeRatesUrl = () => 'https://api.exchangeratesapi.io/latest'

export const getSafeLastVersion = () => process.env.REACT_APP_LATEST_SAFE_VERSION
