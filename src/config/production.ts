import { TX_SERVICE_HOST, SIGNATURES_VIA_METAMASK, RELAY_API_URL, SAFE_APPS_URL } from 'src/config/names'

const prodConfig = {
  [TX_SERVICE_HOST]: 'https://safe-transaction.rinkeby.gnosis.io/api/v1/',
  [SIGNATURES_VIA_METAMASK]: false,
  [RELAY_API_URL]: 'https://safe-relay.rinkeby.gnosis.io/api/v1/',
  [SAFE_APPS_URL]: 'https://apps.gnosis-safe.io/'
}

export default prodConfig
