// @flow
import stagingConfig from './staging'
import { TX_SERVICE_HOST, RELAY_API_URL } from '~/config/names'

const stagingMainnetConfig = {
  ...stagingConfig,
  [TX_SERVICE_HOST]: 'https://safe-transaction.mainnet.gnosis.io/api/v1/',
  [RELAY_API_URL]: 'https://safe-relay.gnosis.io/api/v1/',
}

export default stagingMainnetConfig
