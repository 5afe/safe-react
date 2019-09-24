// @flow
import { ensureOnce } from '~/utils/singleton'
import { TX_SERVICE_HOST, SIGNATURES_VIA_METAMASK, RELAY_API_URL } from '~/config/names'
import devConfig from './development'
import testConfig from './testing'
import prodConfig from './production'
import mainnetProdConfig from './production-mainnet'

const configuration = () => {
  if (process.env.NODE_ENV === 'test') {
    return testConfig
  }

  if (process.env.NODE_ENV === 'production') {
    if (process.env.NETWORK === 'mainnet') {
      return mainnetProdConfig
    }

    return prodConfig
  }

  return devConfig
}

export const getNetwork = () => process.env.NETWORK || 'rinkeby'

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
