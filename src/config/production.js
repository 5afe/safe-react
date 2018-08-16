// @flow
import { TX_SERVICE_HOST, ENABLED_TX_SERVICE_MODULES } from '~/config/names'

const prodConfig = {
  [TX_SERVICE_HOST]: 'https://safe-transaction-history.dev.gnosisdev.com/api/v1/',
  [ENABLED_TX_SERVICE_MODULES]: false,
}

export default prodConfig
