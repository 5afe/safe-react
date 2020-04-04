// 
import stagingConfig from './staging'
import { TX_SERVICE_HOST, RELAY_API_URL } from 'config/names'

const stagingMainnetConfig = {
  ...stagingConfig,
  [TX_SERVICE_HOST]: 'https://safe-transaction.mainnet.staging.gnosisdev.com/api/v1/',
  [RELAY_API_URL]: 'https://safe-relay.mainnet.staging.gnosisdev.com/api/v1/',
}

export default stagingMainnetConfig
