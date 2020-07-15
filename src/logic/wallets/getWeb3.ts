import Web3 from 'web3'

import { sameAddress } from './ethAddresses'
import { EMPTY_DATA } from './ethTransactions'

import { getNetwork } from '../../config'
import { ContentHash } from 'web3-eth-ens'
import { provider as Provider } from 'web3-core'
import { ProviderProps } from './store/model/provider'

export const ETHEREUM_NETWORK = {
  MAINNET: 'MAINNET' as const,
  MORDEN: 'MORDEN' as const,
  ROPSTEN: 'ROPSTEN' as const,
  RINKEBY: 'RINKEBY' as const,
  GOERLI: 'GOERLI' as const,
  KOVAN: 'KOVAN' as const,
  UNKNOWN: 'UNKNOWN' as const,
}

export type EthereumNetworks = typeof ETHEREUM_NETWORK[keyof typeof ETHEREUM_NETWORK]

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
  1: ETHEREUM_NETWORK.MAINNET,
  2: ETHEREUM_NETWORK.MORDEN,
  3: ETHEREUM_NETWORK.ROPSTEN,
  4: ETHEREUM_NETWORK.RINKEBY,
  5: ETHEREUM_NETWORK.GOERLI,
  42: ETHEREUM_NETWORK.KOVAN,
}

export const getEtherScanLink = (type: string, value: string): string => {
  const network = getNetwork()
  return `https://${
    network.toLowerCase() === 'mainnet' ? '' : `${network.toLowerCase()}.`
  }etherscan.io/${type}/${value}`
}

export const getInfuraUrl = (): string => {
  const isMainnet = process.env.REACT_APP_NETWORK === 'mainnet'

  return `https://${isMainnet ? 'mainnet' : 'rinkeby'}.infura.io:443/v3/${process.env.REACT_APP_INFURA_TOKEN}`
}

// With some wallets from web3connect you have to use their provider instance only for signing
// And our own one to fetch data
export const web3ReadOnly =
  process.env.NODE_ENV !== 'test'
    ? new Web3(new Web3.providers.HttpProvider(getInfuraUrl()))
    : new Web3(window.web3?.currentProvider || 'ws://localhost:8545')

let web3 = web3ReadOnly
export const getWeb3 = (): Web3 => web3

export const resetWeb3 = (): void => {
  web3 = web3ReadOnly
}

export const getAccountFrom = async (web3Provider: Web3): Promise<string | null> => {
  const accounts = await web3Provider.eth.getAccounts()

  if (process.env.NODE_ENV === 'test' && window.testAccountIndex) {
    return accounts[window.testAccountIndex]
  }

  return accounts && accounts.length > 0 ? accounts[0] : null
}

export const getNetworkIdFrom = (web3Provider: Web3): Promise<number> => web3Provider.eth.net.getId()

const isHardwareWallet = (walletName: string) =>
  sameAddress(WALLET_PROVIDER.LEDGER, walletName) || sameAddress(WALLET_PROVIDER.TREZOR, walletName)

const isSmartContractWallet = async (web3Provider: Web3, account: string): Promise<boolean> => {
  const contractCode = await web3Provider.eth.getCode(account)

  return contractCode.replace(EMPTY_DATA, '').replace(/0/g, '') !== ''
}

export const getProviderInfo = async (
  web3Provider: string | Provider,
  providerName = 'Wallet',
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

export const getAddressFromENS = (name: string): Promise<string> => web3.eth.ens.getAddress(name)

export const getContentFromENS = (name: string): Promise<ContentHash> => web3.eth.ens.getContenthash(name)

export const setWeb3 = (provider: Provider): void => {
  web3 = new Web3(provider)
}

export const getBalanceInEtherOf = async (safeAddress: string): Promise<string> => {
  if (!web3) {
    return '0'
  }

  const funds = await web3.eth.getBalance(safeAddress)

  if (!funds) {
    return '0'
  }

  return web3.utils.fromWei(funds, 'ether').toString()
}
