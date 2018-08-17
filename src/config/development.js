// @flow
import { TX_SERVICE_HOST, ENABLED_TX_SERVICE_MODULES, ENABLED_TX_SERVICE_REMOVAL_SENDER } from '~/config/names'

const devConfig = {
  [TX_SERVICE_HOST]: 'http://localhost:8000/api/v1/',
  [ENABLED_TX_SERVICE_MODULES]: false,
  [ENABLED_TX_SERVICE_REMOVAL_SENDER]: false,
}

export default devConfig
