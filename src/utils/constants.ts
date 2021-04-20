export const APP_ENV = process.env.REACT_APP_ENV
export const NODE_ENV = process.env.NODE_ENV
export const IS_PRODUCTION = process.env.NODE_ENV === 'production'
export const NETWORK = process.env.REACT_APP_NETWORK?.toUpperCase() || 'RINKEBY'
export const INTERCOM_ID = APP_ENV === 'production' ? process.env.REACT_APP_INTERCOM_ID : 'plssl1fl'
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
export const LATEST_SAFE_VERSION = process.env.REACT_APP_LATEST_SAFE_VERSION || '1.1.1'
export const APP_VERSION = process.env.REACT_APP_APP_VERSION || 'not-defined'
export const OPENSEA_API_KEY = process.env.REACT_APP_OPENSEA_API_KEY || ''
export const COLLECTIBLES_SOURCE = process.env.REACT_APP_COLLECTIBLES_SOURCE || 'Gnosis'
export const TIMEOUT = process.env.NODE_ENV === 'test' ? 1500 : 5000
export const ETHERSCAN_API_KEY = process.env.REACT_APP_ETHERSCAN_API_KEY
export const EXCHANGE_RATE_URL = 'https://api.exchangeratesapi.io/latest'
export const EXCHANGE_RATE_URL_FALLBACK = 'https://api.coinbase.com/v2/exchange-rates'
export const IPFS_GATEWAY = process.env.REACT_APP_IPFS_GATEWAY
export const SPENDING_LIMIT_MODULE_ADDRESS =
  process.env.REACT_APP_SPENDING_LIMIT_MODULE_ADDRESS || '0x1bc46962bced5c37b27531a222a0599d9daf0e41'
