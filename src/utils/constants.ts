export const APP_ENV = process.env.REACT_APP_ENV
export const NODE_ENV = process.env.NODE_ENV
export const IS_PRODUCTION = APP_ENV === 'production'
export const PUBLIC_URL = process.env.PUBLIC_URL
export const INTERCOM_ID = IS_PRODUCTION ? process.env.REACT_APP_INTERCOM_ID : 'plssl1fl'
export const GOOGLE_ANALYTICS_ID = process.env.REACT_APP_GOOGLE_ANALYTICS || ''
export const SENTRY_DSN = process.env.REACT_APP_SENTRY_DSN || ''
export const PORTIS_ID = process.env.REACT_APP_PORTIS_ID ?? '852b763d-f28b-4463-80cb-846d7ec5806b'
export const FORTMATIC_KEY = process.env.REACT_APP_FORTMATIC_KEY ?? 'pk_test_CAD437AA29BE0A40'
/*
 * Not being used
export const SQUARELINK_ID = {
  [ETHEREUM_NETWORK.RINKEBY]: '46ce08fe50913cfa1b78',
  [ETHEREUM_NETWORK.MAINNET]: process.env.REACT_APP_SQUARELINK_ID,
  [ETHEREUM_NETWORK.XDAI]: process.env.REACT_APP_SQUARELINK_ID,
}
 */
export const INFURA_TOKEN = process.env.REACT_APP_INFURA_TOKEN || ''
export const SAFE_APPS_RPC_TOKEN = process.env.REACT_APP_SAFE_APPS_RPC_INFURA_TOKEN || ''
export const LATEST_SAFE_VERSION = process.env.REACT_APP_LATEST_SAFE_VERSION || '1.3.0'
export const APP_VERSION = process.env.REACT_APP_APP_VERSION || 'not-defined'
export const COLLECTIBLES_SOURCE = process.env.REACT_APP_COLLECTIBLES_SOURCE || 'Gnosis'
export const SAFE_POLLING_INTERVAL = process.env.NODE_ENV === 'test' ? 4500 : 15000
export const ETHERSCAN_API_KEY = process.env.REACT_APP_ETHERSCAN_API_KEY || ''
export const ETHGASSTATION_API_KEY = process.env.REACT_APP_ETHGASSTATION_API_KEY
export const CONFIG_SERVICE_URL =
  process.env.CONFIG_SERVICE_URL || IS_PRODUCTION
    ? 'https://safe-config.gnosis.io/api/v1'
    : 'https://safe-config.staging.gnosisdev.com/api/v1'
export const IPFS_GATEWAY = process.env.REACT_APP_IPFS_GATEWAY
export const SPENDING_LIMIT_MODULE_ADDRESS =
  process.env.REACT_APP_SPENDING_LIMIT_MODULE_ADDRESS || '0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134'
export const GNOSISDAO_SAFESNAP_MODULE_ADDRESS =
  process.env.GNOSISDAO_SAFESNAP_MODULE_ADDRESS || '0x0eBaC21F7f6A6599B5fa5f57Baaa974ADFEC4613'
export const KNOWN_MODULES = {
  [SPENDING_LIMIT_MODULE_ADDRESS]: 'Spending limit',
  [GNOSISDAO_SAFESNAP_MODULE_ADDRESS]: 'GnosisDAO SafeSnap',
}
