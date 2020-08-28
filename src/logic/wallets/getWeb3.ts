import Web3 from 'web3'

import { sameAddress } from './ethAddresses'
import { EMPTY_DATA } from './ethTransactions'

import { getNetwork } from 'src/config/index'
import RNS from '@rsksmart/rns'

export const ETHEREUM_NETWORK = {
  MAINNET: 'MAINNET',
  MORDEN: 'MORDEN',
  ROPSTEN: 'ROPSTEN',
  RINKEBY: 'RINKEBY',
  GOERLI: 'GOERLI',
  KOVAN: 'KOVAN',
  UNKNOWN: 'UNKNOWN',
  RSK: 'RSK_MAINNET',
  TESTNET: 'RSK_TESTNET'
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
  LEDGER: 'LEDGER',
  TREZOR: 'TREZOR',
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
  // RSK
  30: ETHEREUM_NETWORK.RSK,
  31: ETHEREUM_NETWORK.TESTNET
}

export const getExplorerLink = (type, value) => {
  const network = getNetwork()
  return `https://explorer.${
    network.toLowerCase() === 'rsk_mainnet' ? '' : 'testnet.'
  }rsk.co/${type}/${value}`
}

export const getNodeUrl = () => {
  const isMainnet = process.env.REACT_APP_NETWORK === 'mainnet'
  return `https://public-node.${isMainnet ? '' : 'testnet.'}rsk.co`
}


// With some wallets from web3connect you have to use their provider instance only for signing
// And our own one to fetch data
export const web3ReadOnly =
  process.env.NODE_ENV !== 'test'
    ? new Web3(new Web3.providers.HttpProvider(getNodeUrl()))
    : new Web3((window as any).web3.currentProvider)

let web3 = web3ReadOnly
export const getWeb3 = () => web3

export const resetWeb3 = () => {
  web3 = web3ReadOnly
}

export const getAccountFrom = async (web3Provider) => {
  const accounts = await web3Provider.eth.getAccounts()

  if (process.env.NODE_ENV === 'test' && (window as any).testAccountIndex) {
    return accounts[(window as any).testAccountIndex]
  }

  return accounts && accounts.length > 0 ? accounts[0].toLowerCase() : null
}

export const getNetworkIdFrom = (web3Provider) => web3Provider.eth.net.getId()

const isHardwareWallet = (walletName) =>
  sameAddress(WALLET_PROVIDER.LEDGER, walletName) || sameAddress(WALLET_PROVIDER.TREZOR, walletName)

const isSmartContractWallet = async (web3Provider, account) => {
  const contractCode = await web3Provider.eth.getCode(account)

  return contractCode.replace(EMPTY_DATA, '').replace(/0/g, '') !== ''
}

export const getProviderInfo = async (web3Provider, providerName = 'Wallet') => {
  web3 = new Web3(web3Provider)

  const account = await getAccountFrom(web3)
  const network = await getNetworkIdFrom(web3)
  const smartContractWallet = await isSmartContractWallet(web3, account)
  const hardwareWallet = isHardwareWallet(providerName)

  const available = account !== null

  return {
    name: providerName,
    available,
    loaded: true,
    account,
    network,
    smartContractWallet,
    hardwareWallet,
  }
}

let rns = new RNS(web3)
export const getAddressFromRNS = (name: string) => rns.addr(name)

export const getContentFromENS = (name: string) => web3.eth.ens.getContenthash(name)

export const setWeb3 = (provider) => {
  web3 = new Web3(provider)
}

export const getBalanceInEtherOf = async (safeAddress) => {
  if (!web3) {
    return '0'
  }

  const funds = await web3.eth.getBalance(safeAddress)

  if (!funds) {
    return '0'
  }

  return web3.utils.fromWei(funds, 'ether').toString()
}
