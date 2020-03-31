// @flow
import ENS from 'ethereum-ens'
import Web3 from 'web3'

import { sameAddress } from './ethAddresses'
import { EMPTY_DATA } from './ethTransactions'

import { getNetwork } from '~/config/index'
import type { ProviderProps } from '~/logic/wallets/store/model/provider'

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
  LEDGER: 'LEDGER',
  TREZOR: 'TREZOR',
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

export const getInfuraUrl = () => {
  const isMainnet = process.env.REACT_APP_NETWORK === 'mainnet'

  return `https://${isMainnet ? 'mainnet' : 'rinkeby'}.infura.io:443/v3/${process.env.REACT_APP_INFURA_TOKEN}`
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

export const getAccountFrom: Function = async (web3Provider): Promise<string | null> => {
  const accounts = await web3Provider.eth.getAccounts()

  if (process.env.NODE_ENV === 'test' && window.testAccountIndex) {
    return accounts[window.testAccountIndex]
  }

  return accounts && accounts.length > 0 ? accounts[0] : null
}

export const getNetworkIdFrom = (web3Provider) => web3Provider.eth.net.getId()

const isHardwareWallet = (walletName: $Values<typeof WALLET_PROVIDER>) =>
  sameAddress(WALLET_PROVIDER.LEDGER, walletName) || sameAddress(WALLET_PROVIDER.TREZOR, walletName)

const isSmartContractWallet = async (web3Provider, account) => {
  const contractCode: string = await web3Provider.eth.getCode(account)

  return contractCode.replace(EMPTY_DATA, '').replace(/0/g, '') !== ''
}

export const getProviderInfo: Function = async (
  web3Provider,
  providerName: string = 'Wallet',
): Promise<ProviderProps> => {
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

export const getAddressFromENS = async (name: string) => {
  const ens = new ENS(web3)
  return await ens.resolver(name).addr()
}

export const setWeb3 = (provider: Object) => {
  web3 = new Web3(provider)
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
