import stagingConfig from './staging'
import { TX_SERVICE_HOST, RELAY_API_URL, SAFE_APPS_URL } from 'src/config/names'
import { SAFE_APPS_URL_STG, TX_SERVICE_HOST_MAINNET_STG, RELAY_API_URL_MAINNET_STG } from './constants'

const stagingMainnetConfig = {
  ...stagingConfig,
  [TX_SERVICE_HOST]: TX_SERVICE_HOST_MAINNET_STG,
  [RELAY_API_URL]: RELAY_API_URL_MAINNET_STG  
}

export default stagingMainnetConfig
