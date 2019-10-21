// @flow
import { ensureOnce } from '~/utils/singleton'
import { ETHEREUM_NETWORK } from '~/logic/wallets/constants'
import { TX_SERVICE_HOST, SIGNATURES_VIA_METAMASK, RELAY_API_URL } from '~/config/names'
import devConfig from './development'
import testConfig from './testing'
import stagingConfig from './staging'
import prodConfig from './production'
import mainnetDevConfig from './development-mainnet'
import mainnetProdConfig from './production-mainnet'
import mainnetStagingConfig from './staging-mainnet'

const configuration = () => {
  if (process.env.NODE_ENV === 'test') {
    return testConfig
  }

  if (process.env.NODE_ENV === 'production') {
    if (process.env.REACT_APP_NETWORK === 'mainnet') {
      return process.env.REACT_APP_ENV === 'production' ? mainnetProdConfig : mainnetStagingConfig
    }

    return process.env.REACT_APP_ENV === 'production' ? prodConfig : stagingConfig
  }

  return process.env.REACT_APP_NETWORK === 'mainnet' ? mainnetDevConfig : devConfig
}

export const getNetwork = () => (process.env.REACT_APP_NETWORK === 'mainnet' ? ETHEREUM_NETWORK.MAINNET : ETHEREUM_NETWORK.RINKEBY)

const getConfig = ensureOnce(configuration)

export const getTxServiceHost = () => {
  const config = getConfig()

  return config[TX_SERVICE_HOST]
}

export const getTxServiceUriFrom = (safeAddress: string) => `safes/${safeAddress}/transactions/`

export const getRelayUrl = () => getConfig()[RELAY_API_URL]

export const signaturesViaMetamask = () => {
  const config = getConfig()

  return config[SIGNATURES_VIA_METAMASK]
}
