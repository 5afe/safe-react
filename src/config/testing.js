// @flow
import {
  TX_SERVICE_HOST,
  ENABLED_TX_SERVICE_MODULES,
  ENABLED_TX_SERVICE_REMOVAL_SENDER,
  SIGNATURES_VIA_METAMASK,
} from '~/config/names'

const testConfig = {
  [TX_SERVICE_HOST]: 'http://localhost:8000/api/v1/',
  [ENABLED_TX_SERVICE_MODULES]: false,
  [ENABLED_TX_SERVICE_REMOVAL_SENDER]: false,
  [SIGNATURES_VIA_METAMASK]: false,
}

export default testConfig
