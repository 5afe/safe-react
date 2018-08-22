// @flow
import {
  TX_SERVICE_HOST,
  ENABLED_TX_SERVICE_MODULES,
  ENABLED_TX_SERVICE_REMOVAL_SENDER,
  SIGNATURES_VIA_METAMASK,
} from '~/config/names'

const prodConfig = {
  [TX_SERVICE_HOST]: 'https://safe-transaction-history.dev.gnosisdev.com/api/v1/',
  [ENABLED_TX_SERVICE_MODULES]: false,
  [ENABLED_TX_SERVICE_REMOVAL_SENDER]: false,
  [SIGNATURES_VIA_METAMASK]: true,
}

export default prodConfig
