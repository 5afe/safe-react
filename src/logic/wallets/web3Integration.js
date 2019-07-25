// @flow
import Web3 from 'web3'
import { fetchProvider, removeProvider } from '~/logic/wallets/store/actions'
import { store } from '~/store'
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

class Web3Integration {
  provider: Object

  watcherInterval: IntervalID

  constructor() {
    this.provider = null
  }

  async getAccount(): Promise<string | null> {
    const accounts = await this.web3.eth.getAccounts()

    return accounts && accounts.length > 0 ? accounts[0] : null
  }

  getProviderName(): string {
    let name

    switch (this.web3.currentProvider.constructor.name) {
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

  async getNetworkId() {
    const networkId = await this.web3.eth.net.getId()

    return networkId
  }

  async getBalanceInEtherOf(safeAddress: string): Promise<string> {
    const funds: string = await this.web3.eth.getBalance(safeAddress)

    if (!funds) {
      return '0'
    }

    return this.web3.utils.fromWei(funds, 'ether').toString()
  }

  async getProviderInfo(): Promise<ProviderProps> {
    if (!this.provider) {
      await this.checkForInjectedProvider()

      if (!this.provider) {
        return {
          name: '',
          available: false,
          loaded: false,
          account: '',
          network: 0,
        }
      }
    }

    const name = this.getProviderName()
    const account = await this.getAccount()
    const network = await this.getNetworkId()

    const available = account !== null

    return {
      name,
      available,
      loaded: true,
      account,
      network,
    }
  }

  async watch() {
    let currentProviderInfo = await this.getProviderInfo()

    this.watcherInterval = setInterval(async () => {
      const providerInfo: ProviderProps = await this.getProviderInfo()
      if (JSON.stringify(currentProviderInfo) !== JSON.stringify(providerInfo)) {
        store.dispatch(fetchProvider(providerInfo))
      }
      currentProviderInfo = providerInfo
    }, 2000)
  }

  async checkForInjectedProvider() {
    let web3Provider

    if (window.ethereum) {
      web3Provider = window.ethereum
      await web3Provider.enable()
    } else if (window.web3) {
      web3Provider = window.web3.currentProvider
    }

    this.setWeb3(web3Provider)
  }

  resetWalletConnectSession() {
    if (localStorage.getItem('walletconnect')) {
      localStorage.removeItem('walletconnect')
    }
  }

  get web3() {
    return (
      this.provider
      || (window.web3 && new Web3(window.web3.currentProvider))
      || (window.ethereum && new Web3(window.ethereum))
    )
  }

  disconnect() {
    clearInterval(this.watcherInterval)
    this.resetWalletConnectSession()
    store.dispatch(removeProvider())
  }

  async setWeb3(provider: Object) {
    if (!provider) {
      throw new Error('No provider object provided')
    }

    this.provider = new Web3(provider)

    const providerInfo = await this.getProviderInfo()
    store.dispatch(fetchProvider(providerInfo))
    this.watch()
  }
}

export default new Web3Integration()
