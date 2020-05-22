import { ETHEREUM_NETWORK } from 'src/logic/wallets/getWeb3'

export const NETWORK = process.env.REACT_APP_NETWORK || ETHEREUM_NETWORK.RINKEBY
export const GOOGLE_ANALYTICS_ID_RINKEBY = process.env.REACT_APP_GOOGLE_ANALYTICS_ID_RINKEBY
export const GOOGLE_ANALYTICS_ID_MAINNET = process.env.REACT_APP_GOOGLE_ANALYTICS_ID_MAINNET
export const INTERCOM_ID = process.env.REACT_APP_INTERCOM_ID
export const PORTIS_ID = process.env.REACT_APP_PORTIS_ID
export const SQUARELINK_ID = process.env.REACT_APP_SQUARELINK_ID
export const FORTMATIC_KEY = process.env.REACT_APP_FORTMATIC_KEY
export const INFURA_TOKEN = process.env.REACT_APP_INFURA_TOKEN || ''
export const LATEST_SAFE_VERSION = process.env.REACT_APP_LATEST_SAFE_VERSION || 'not-defined'
export const APP_VERSION = process.env.REACT_APP_APP_VERSION || 'not-defined'
export const OPENSEA_API_KEY = process.env.REACT_APP_OPENSEA_API_KEY || ''
export const COLLECTIBLES_SOURCE = process.env.REACT_APP_COLLECTIBLES_SOURCE || 'OpenSea'
export const TIMEOUT = process.env.NODE_ENV === 'test' ? 1500 : 5000
export const ETHERSCAN_API_KEY = process.env.REACT_APP_ETHERSCAN_API_KEY
