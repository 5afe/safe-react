// @flow
import { ensureOnce } from '~/utils/singleton'
import { TX_SERVICE_HOST } from '~/config/names'
import devConfig from './development'
import testConfig from './testing'
import prodConfig from './production'

const configuration = () => {
  if (process.env.NODE_ENV === 'test') {
    return testConfig
  }

  if (process.env.NODE_ENV === 'production') {
    return prodConfig
  }

  return devConfig
}

const getConfig = ensureOnce(configuration)

export const getTxServiceHost = () => {
  const config = getConfig()

  return config[TX_SERVICE_HOST]
}

export const getTxServiceUriFrom = (safeAddress: string) => `safes/${safeAddress}/transactions/`
