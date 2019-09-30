// @flow
import devConfig from './development'
import { TX_SERVICE_HOST, RELAY_API_URL } from '~/config/names'

const devMainnetConfig = {
  ...devConfig,
  [TX_SERVICE_HOST]: 'https://safe-transaction.mainnet.staging.gnosisdev.com/api/v1',
  [RELAY_API_URL]: 'https://safe-relay.gnosis.io/api/v1/',
}

export default devMainnetConfig
