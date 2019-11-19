// @flow
import { TX_SERVICE_HOST, SIGNATURES_VIA_METAMASK, RELAY_API_URL } from '~/config/names'

const stagingConfig = {
  [TX_SERVICE_HOST]: 'https://safe-transaction.staging.gnosisdev.com/api/v1/',
  [SIGNATURES_VIA_METAMASK]: false,
  [RELAY_API_URL]: 'https://safe-relay.staging.gnosisdev.com/api/v1/',
}

export default stagingConfig
