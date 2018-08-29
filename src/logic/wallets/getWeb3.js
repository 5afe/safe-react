// @flow
import { BigNumber } from 'bignumber.js'
import Web3 from 'web3'
import type { ProviderProps } from '~/logic/wallets/store/model/provider'
import { promisify } from '~/utils/promisify'

export const ETHEREUM_NETWORK = {
  MAIN: 'MAIN',
  MORDEN: 'MORDEN',
  ROPSTEN: 'ROPSTEN',
  RINKEBY: 'RINKEBY',
  KOVAN: 'KOVAN',
  UNKNOWN: 'UNKNOWN',
}

export const WALLET_PROVIDER = {
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


let web3
export const getWeb3 = () => web3 || new Web3(window.web3.currentProvider)

const isMetamask: Function = (web3Provider): boolean => {
  const isMetamaskConstructor = web3Provider.currentProvider.constructor.name === 'MetamaskInpageProvider'

  return isMetamaskConstructor || web3Provider.currentProvider.isMetaMask
}

const getAccountFrom: Function = async (web3Provider): Promise<string | null> => {
  const accounts = await promisify(cb => web3Provider.eth.getAccounts(cb))

  return accounts && accounts.length > 0 ? accounts[0] : null
}

const getNetworkIdFrom = async (web3Provider) => {
  const networkId = await promisify(cb => web3Provider.version.getNetwork(cb))

  return networkId
}

export const getProviderInfo: Function = async (): Promise<ProviderProps> => {
  if (typeof window.web3 === 'undefined') {
    return {
      name: '', available: false, loaded: false, account: '', network: 0,
    }
  }

  // Use MetaMask's provider.
  web3 = new Web3(window.web3.currentProvider)

  if (process.env.NODE_ENV !== 'test') {
    // eslint-disable-next-line
    console.log('Injected web3 detected.')
  }

  const name = isMetamask(web3) ? WALLET_PROVIDER.METAMASK : 'UNKNOWN'
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
  const funds: BigNumber = await promisify(cb => web3.eth.getBalance(safeAddress, cb))
  if (!funds) {
    return '0'
  }

  return web3.fromWei(funds.toNumber(), 'ether').toString()
}
