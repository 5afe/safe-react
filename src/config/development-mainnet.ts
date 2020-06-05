
import devConfig from './development'
import { TX_SERVICE_HOST, RELAY_API_URL, SAFE_APPS_URL } from 'src/config/names'
import { SAFE_APPS_URL_DEV, TX_SERVICE_HOST_MAINNET_STG, RELAY_API_URL_MAINNET_STG } from './constants'

const devMainnetConfig = {
  ...devConfig,
  [TX_SERVICE_HOST]: TX_SERVICE_HOST_MAINNET_STG,
  [RELAY_API_URL]: RELAY_API_URL_MAINNET_STG
}

export default devMainnetConfig
