import { NETWORK } from 'src/utils/constants'
import Web3 from 'web3'

import { sameAddress } from './ethAddresses'
import { EMPTY_DATA } from './ethTransactions'

import { getNetwork } from 'src/config'
import { ContentHash } from 'web3-eth-ens'
import { provider as Provider } from 'web3-core'
import { ProviderProps } from './store/model/provider'

export enum ETHEREUM_NETWORK {
  MAINNET = 1,
  MORDEN = 2,
  ROPSTEN = 3,
  RINKEBY = 4,
  GOERLI = 5,
  KOVAN = 42,
  ENERGY_WEB_CHAIN = 246,
  VOLTA = 73799,
  UNKNOWN = 0,
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
  UNILOGIN: 'UNILOGIN',
  WALLETCONNECT: 'WALLETCONNECT',
  OPERA: 'OPERA',
  DAPPER: 'DAPPER',
  WALLETLINK: 'WALLETLINK',
  AUTHEREUM: 'AUTHEREUM',
  LEDGER: 'LEDGER',
  TREZOR: 'TREZOR',
}

export enum ExplorerTypes {
  Tx = 'tx',
  Address = 'address',
}

export const getEtherScanLink = (network: ETHEREUM_NETWORK, type: ExplorerTypes, value: string): string =>
  `https://${
    network === ETHEREUM_NETWORK.MAINNET ? '' : `${network[network].toLowerCase()}.`
  }etherscan.io/${type}/${value}`

export const getExplorerLink = (type: ExplorerTypes, value: string): string => {
  const network = getNetwork()

  switch (network) {
    case ETHEREUM_NETWORK.MAINNET:
      return getEtherScanLink(ETHEREUM_NETWORK.MAINNET, type, value)
    case ETHEREUM_NETWORK.RINKEBY:
      return getEtherScanLink(ETHEREUM_NETWORK.RINKEBY, type, value)
    case ETHEREUM_NETWORK.ENERGY_WEB_CHAIN:
      return `https://explorer.energyweb.org/${type}/${value}`
    case ETHEREUM_NETWORK.VOLTA:
      return `https://volta-explorer.energyweb.org/${type}/${value}`
    default:
      return getEtherScanLink(network, type, value)
  }
}

export const getInfuraUrl = (network: ETHEREUM_NETWORK): string =>
  `https://${network === ETHEREUM_NETWORK.MAINNET ? 'mainnet' : 'rinkeby'}.infura.io:443/v3/${
    process.env.REACT_APP_INFURA_TOKEN
  }`

export const getRPCUrl = (network: ETHEREUM_NETWORK): string => {
  switch (network) {
    case ETHEREUM_NETWORK.MAINNET:
      return getInfuraUrl(network)
    case ETHEREUM_NETWORK.RINKEBY:
      return getInfuraUrl(network)
    case ETHEREUM_NETWORK.ENERGY_WEB_CHAIN:
      return 'https://rpc.energyweb.org'
    case ETHEREUM_NETWORK.VOLTA:
      return 'https://volta-rpc.energyweb.org'
    default:
      return ''
  }
}

// With some wallets from web3connect you have to use their provider instance only for signing
// And our own one to fetch data
export const web3ReadOnly = new Web3(
  process.env.NODE_ENV !== 'test'
    ? new Web3.providers.HttpProvider(getRPCUrl(ETHEREUM_NETWORK[NETWORK] ?? ETHEREUM_NETWORK.RINKEBY))
    : window.web3?.currentProvider || 'ws://localhost:8545',
)

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

export const getProviderInfo = async (web3Instance: Web3, providerName = 'Wallet'): Promise<ProviderProps> => {
  const account = (await getAccountFrom(web3Instance)) || ''
  const network = await getNetworkIdFrom(web3Instance)
  const smartContractWallet = await isSmartContractWallet(web3Instance, account)
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
