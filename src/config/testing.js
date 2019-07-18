// @flow
import {
  TX_SERVICE_HOST,
  ENABLED_TX_SERVICE_REMOVAL_SENDER,
  SIGNATURES_VIA_METAMASK,
  RELAY_API_URL,
} from '~/config/names'

const testConfig = {
  [TX_SERVICE_HOST]: 'https://safe-transaction-service.dev.gnosisdev.com/api/v1/',
  [ENABLED_TX_SERVICE_REMOVAL_SENDER]: false,
  [SIGNATURES_VIA_METAMASK]: false,
  [RELAY_API_URL]: 'https://safe-relay.staging.gnosisdev.com/api/v1',
}

export default testConfig
