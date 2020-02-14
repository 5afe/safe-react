// @flow
import Web3 from 'web3'
import ENS from 'ethereum-ens'
import type { ProviderProps } from '~/logic/wallets/store/model/provider'
import { getNetwork } from '~/config/index'

export const ETHEREUM_NETWORK = {
  MAINNET: 'MAINNET',
  MORDEN: 'MORDEN',
  ROPSTEN: 'ROPSTEN',
  RINKEBY: 'RINKEBY',
  GOERLI: 'GOERLI',
  KOVAN: 'KOVAN',
  UNKNOWN: 'UNKNOWN',
}

export const WALLET_PROVIDER = {
  SAFE: 'SAFE',
  METAMASK: 'METAMASK',
  REMOTE: 'REMOTE',
  TORUS: 'TORUS',
  PORTIS: 'PORTIS',
  FORTMATIC: 'FORTMATIC',
  SQUARELINK: 'SQUARELINK',
  WALLETCONNECT: 'WALLETCONNECT',
  OPERA: 'OPERA',
  DAPPER: 'DAPPER',
  AUTHEREUM: 'AUTHEREUM',
}

export const INJECTED_PROVIDERS = [
  WALLET_PROVIDER.SAFE,
  WALLET_PROVIDER.METAMASK,
  WALLET_PROVIDER.OPERA,
  WALLET_PROVIDER.DAPPER,
]

export const ETHEREUM_NETWORK_IDS = {
  // $FlowFixMe
  1: ETHEREUM_NETWORK.MAINNET,
  // $FlowFixMe
  2: ETHEREUM_NETWORK.MORDEN,
  // $FlowFixMe
  3: ETHEREUM_NETWORK.ROPSTEN,
  // $FlowFixMe
  4: ETHEREUM_NETWORK.RINKEBY,
  // $FlowFixMe
  5: ETHEREUM_NETWORK.GOERLI,
  // $FlowFixMe
  42: ETHEREUM_NETWORK.KOVAN,
}

export const getEtherScanLink = (type: 'address' | 'tx', value: string) => {
  const network = getNetwork()
  return `https://${
    network.toLowerCase() === 'mainnet' ? '' : `${network.toLowerCase()}.`
  }etherscan.io/${type}/${value}`
}

const getInfuraUrl = () => {
  const isMainnet = process.env.REACT_APP_NETWORK === 'mainnet'

  return `https://${isMainnet ? 'mainnet' : 'rinkeby'}.infura.io:443/v3/${
    process.env.REACT_APP_INFURA_TOKEN
  }`
}

// With some wallets from web3connect you have to use their provider instance only for signing
// And our own one to fetch data
export const web3ReadOnly =
  process.env.NODE_ENV !== 'test'
    ? new Web3(new Web3.providers.HttpProvider(getInfuraUrl()))
    : new Web3(window.web3.currentProvider)

let web3 = web3ReadOnly
export const getWeb3 = () => web3

export const resetWeb3 = () => {
  web3 = web3ReadOnly
}

const getProviderName: Function = (web3Provider): string => {
  let name

  switch (web3Provider.currentProvider.constructor.name) {
    case 'SafeWeb3Provider':
      name = WALLET_PROVIDER.SAFE
      break
    case 'MetamaskInpageProvider':
      name = WALLET_PROVIDER.METAMASK

      if (web3Provider.currentProvider.isTorus) {
        name = WALLET_PROVIDER.TORUS
      }
      break
    case 'Object':
      if (navigator && /Opera|OPR\//.test(navigator.userAgent)) {
        name = WALLET_PROVIDER.OPERA
      } else {
        name = 'Wallet'
      }
      break
    case 'DapperLegacyProvider':
      name = WALLET_PROVIDER.DAPPER
      break
    default:
      name = 'Wallet'
  }

  if (web3Provider.currentProvider.isPortis) {
    name = WALLET_PROVIDER.PORTIS
  }

  if (web3Provider.currentProvider.isFortmatic) {
    name = WALLET_PROVIDER.FORTMATIC
  }

  if (web3Provider.currentProvider.isSquarelink) {
    name = WALLET_PROVIDER.SQUARELINK
  }

  if (web3Provider.currentProvider.isWalletConnect) {
    name = WALLET_PROVIDER.WALLETCONNECT
  }

  if (web3Provider.currentProvider.isAuthereum) {
    name = WALLET_PROVIDER.AUTHEREUM
  }

  return name
}

export const getAccountFrom: Function = async (
  web3Provider
): Promise<string | null> => {
  const accounts = await web3Provider.eth.getAccounts()

  if (process.env.NODE_ENV === 'test' && window.testAccountIndex) {
    return accounts[window.testAccountIndex]
  }

  return accounts && accounts.length > 0 ? accounts[0] : null
}

const getNetworkIdFrom = async web3Provider => {
  const networkId = await web3Provider.eth.net.getId()

  return networkId
}

export const getProviderInfo: Function = async (
  web3Provider
): Promise<ProviderProps> => {
  web3 = new Web3(web3Provider)

  const name = getProviderName(web3)
  const account = await getAccountFrom(web3)
  const network = await getNetworkIdFrom(web3)

  const available = account !== null

  return {
    name,
    available,
    loaded: true,
    account,
    network,
  }
}

export const getAddressFromENS = async (name: string) => {
  const ens = new ENS(web3)
  const address = await ens.resolver(name).addr()

  return address
}

export const getBalanceInEtherOf = async (safeAddress: string) => {
  if (!web3) {
    return '0'
  }

  const funds: string = await web3.eth.getBalance(safeAddress)

  if (!funds) {
    return '0'
  }

  return web3.utils.fromWei(funds, 'ether').toString()
}
