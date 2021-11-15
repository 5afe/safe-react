import { ChainInfo } from '@gnosis.pm/safe-react-gateway-sdk'

export type SHORT_NAME = ChainInfo['shortName']

// The CGW is the single source of true
export type ETHEREUM_NETWORK = ChainInfo['chainId']

// This enum is purely used for edge cases where need to check a network id
export enum NETWORK_ID {
  UNKNOWN = '0',
  MAINNET = '1',
  MORDEN = '2',
  ROPSTEN = '3',
  RINKEBY = '4',
  GOERLI = '5',
  KOVAN = '42',
  BSC = '56',
  XDAI = '100',
  POLYGON = '137',
  ENERGY_WEB_CHAIN = '246',
  ARBITRUM = '42161',
  VOLTA = '73799',
}

// TODO: Move this to the client-gateway-sdk
export enum WALLETS {
  METAMASK = 'metamask',
  WALLET_CONNECT = 'walletConnect',
  TREZOR = 'trezor',
  LEDGER = 'ledger',
  TRUST = 'trust',
  FORTMATIC = 'fortmatic',
  PORTIS = 'portis',
  AUTHEREUM = 'authereum',
  TORUS = 'torus',
  COINBASE = 'coinbase',
  WALLET_LINK = 'walletLink',
  OPERA = 'opera',
  OPERA_TOUCH = 'operaTouch',
  LATTICE = 'lattice',
  KEYSTONE = 'keystone',
}
