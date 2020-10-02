export const NETWORK = process.env.REACT_APP_NETWORK || 'RINKEBY'
export const GOOGLE_ANALYTICS_ID = {
  RINKEBY: process.env.REACT_APP_GOOGLE_ANALYTICS_ID_RINKEBY,
  MAINNET: process.env.REACT_APP_GOOGLE_ANALYTICS_ID_MAINNET,
}
export const INTERCOM_ID = process.env.REACT_APP_ENV === 'production' ? process.env.REACT_APP_INTERCOM_ID : 'plssl1fl'
export const PORTIS_ID = process.env.REACT_APP_PORTIS_ID
export const SQUARELINK_ID = process.env.REACT_APP_SQUARELINK_ID
export const FORTMATIC_KEY = process.env.REACT_APP_FORTMATIC_KEY
export const INFURA_TOKEN = process.env.REACT_APP_INFURA_TOKEN || ''
export const LATEST_SAFE_VERSION = process.env.REACT_APP_LATEST_SAFE_VERSION || '1.1.1'
export const APP_VERSION = process.env.REACT_APP_APP_VERSION || 'not-defined'
export const OPENSEA_API_KEY = process.env.REACT_APP_OPENSEA_API_KEY || ''
export const COLLECTIBLES_SOURCE = process.env.REACT_APP_COLLECTIBLES_SOURCE || 'OpenSea'
export const TIMEOUT = process.env.NODE_ENV === 'test' ? 1500 : 5000
export const ETHERSCAN_API_KEY = process.env.REACT_APP_ETHERSCAN_API_KEY
export const EXCHANGE_RATE_URL = 'https://api.exchangeratesapi.io/latest'
export const EXCHANGE_RATE_URL_FALLBACK = 'https://api.coinbase.com/v2/exchange-rates'
