// @flow
import Web3 from 'web3'
import type { ProviderProps } from '~/logic/wallets/store/model/provider'

export const ETHEREUM_NETWORK = {
  MAIN: 'MAIN',
  MORDEN: 'MORDEN',
  ROPSTEN: 'ROPSTEN',
  RINKEBY: 'RINKEBY',
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
  1: ETHEREUM_NETWORK.MAIN,
  // $FlowFixMe
  2: ETHEREUM_NETWORK.MORDEN,
  // $FlowFixMe
  3: ETHEREUM_NETWORK.ROPSTEN,
  // $FlowFixMe
  4: ETHEREUM_NETWORK.RINKEBY,
  // $FlowFixMe
  42: ETHEREUM_NETWORK.KOVAN,
}

export const openTxInEtherScan = (txHash: string, network: string) => `https://${network === 'mainnet' ? '' : `${network}.`}etherscan.io/tx/${txHash}`

export const getEtherScanLink = (address: string, network: string) => `https://${network === 'mainnet' ? '' : `${network}.`}etherscan.io/address/${address}`

let web3
export const getWeb3 = () => web3 || (window.web3 && new Web3(window.web3.currentProvider)) || (window.ethereum && new Web3(window.ethereum))

const getProviderName: Function = (web3Provider): boolean => {
  let name

  switch (web3Provider.currentProvider.constructor.name) {
  case 'SafeWeb3Provider':
    name = WALLET_PROVIDER.SAFE
    break
  case 'MetamaskInpageProvider':
    name = WALLET_PROVIDER.METAMASK
    break
  default:
    name = 'UNKNOWN'
  }

  return name
}

const getAccountFrom: Function = async (web3Provider): Promise<string | null> => {
  const accounts = await web3Provider.eth.getAccounts()

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
    await web3Provider.enable()
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

export const getBalanceInEtherOf = async (safeAddress: string) => {
  const funds: String = await web3.eth.getBalance(safeAddress)

  if (!funds) {
    return '0'
  }

  return web3.utils.fromWei(funds, 'ether').toString()
}
