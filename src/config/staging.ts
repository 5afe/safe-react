import { TX_SERVICE_HOST, SIGNATURES_VIA_METAMASK, RELAY_API_URL, SAFE_APPS_URL } from 'src/config/names'
import { SAFE_APPS_URL_STG, TX_SERVICE_HOST_STG, RELAY_API_URL_STG } from './constants'

const stagingConfig = {
  [TX_SERVICE_HOST]: TX_SERVICE_HOST_STG,
  [RELAY_API_URL]: RELAY_API_URL_STG,
  [SAFE_APPS_URL]: SAFE_APPS_URL_STG,
  [SIGNATURES_VIA_METAMASK]: false
}

export default stagingConfig
