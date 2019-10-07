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
  PARITY: 'PARITY',
  REMOTE: 'REMOTE',
  UPORT: 'UPORT',
}

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

let web3
export const getWeb3 = () => web3 || (window.web3 && new Web3(window.web3.currentProvider)) || (window.ethereum && new Web3(window.ethereum))

const getProviderName: Function = (web3Provider): string => {
  let name

  switch (web3Provider.currentProvider.constructor.name) {
    case 'SafeWeb3Provider':
      name = WALLET_PROVIDER.SAFE
      break
    case 'MetamaskInpageProvider':
      name = WALLET_PROVIDER.METAMASK
      break
    default:
      name = 'Wallet'
  }

  return name
}

export const getAccountFrom: Function = async (web3Provider): Promise<string | null> => {
  const accounts = await web3Provider.eth.getAccounts()

  if (process.env.NODE_ENV === 'test' && window.testAccountIndex) {
    return accounts[window.testAccountIndex]
  }

  return accounts && accounts.length > 0 ? accounts[0] : null
}

const getNetworkIdFrom = async (web3Provider) => {
  const networkId = await web3Provider.eth.net.getId()

  return networkId
}

export const getProviderInfo: Function = async (): Promise<ProviderProps> => {
  let web3Provider

  if (window.ethereum) {
    web3Provider = window.ethereum
    try {
      await web3Provider.enable()
    } catch (error) {
      console.error('Error when enabling web3 provider', error)
    }
  } else if (window.web3) {
    web3Provider = window.web3.currentProvider
  } else {
    return {
      name: '',
      available: false,
      loaded: false,
      account: '',
      network: 0,
    }
  }

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

  const funds: String = await web3.eth.getBalance(safeAddress)

  if (!funds) {
    return '0'
  }

  return web3.utils.fromWei(funds, 'ether').toString()
}
