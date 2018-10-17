// @flow
import { ensureOnce } from '~/utils/singleton'
import {
  TX_SERVICE_HOST,
  ENABLED_TX_SERVICE_REMOVAL_SENDER,
  SIGNATURES_VIA_METAMASK,
} from '~/config/names'
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

export const allowedRemoveSenderInTxHistoryService = () => {
  const config = getConfig()

  return config[ENABLED_TX_SERVICE_REMOVAL_SENDER]
}

export const signaturesViaMetamask = () => {
  const config = getConfig()

  return config[SIGNATURES_VIA_METAMASK]
}
