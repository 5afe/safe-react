// @flow
import {
  TX_SERVICE_HOST,
  ENABLED_TX_SERVICE_REMOVAL_SENDER,
  SIGNATURES_VIA_METAMASK,
  RELAY_API_URL,
} from '~/config/names'

const devConfig = {
  [TX_SERVICE_HOST]: 'http://localhost:8000/api/v1/',
  [ENABLED_TX_SERVICE_REMOVAL_SENDER]: false,
  [SIGNATURES_VIA_METAMASK]: false,
  [RELAY_API_URL]: 'https://safe-relay.staging.gnosisdev.com/api/v1/',
}

export default devConfig
