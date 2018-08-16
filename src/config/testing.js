// @flow
import { TX_SERVICE_HOST, ENABLED_TX_SERVICE_MODULES } from '~/config/names'

const testConfig = {
  [TX_SERVICE_HOST]: 'http://localhost:8000/api/v1/',
  [ENABLED_TX_SERVICE_MODULES]: false,
}

export default testConfig
