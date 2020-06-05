import prodConfig from './production'
import { TX_SERVICE_HOST, RELAY_API_URL, SAFE_APPS_URL } from 'src/config/names'
import { SAFE_APPS_URL_PROD, TX_SERVICE_HOST_MAINNET, RELAY_API_URL_MAINNET } from './constants'

const prodMainnetConfig = {
  ...prodConfig,
  [TX_SERVICE_HOST]: TX_SERVICE_HOST_MAINNET,
  [RELAY_API_URL]: RELAY_API_URL_MAINNET
}

export default prodMainnetConfig
