// @flow
import { BigNumber } from 'bignumber.js'
import Web3 from 'web3'
import type { ProviderProps } from '~/wallets/store/model/provider'
import { promisify } from '~/utils/promisify'

let web3
export const getWeb3 = () => web3

const isMetamask: Function = (web3Provider): boolean => {
  const isMetamaskConstructor = web3Provider.currentProvider.constructor.name === 'MetamaskInpageProvider'

  return isMetamaskConstructor || web3Provider.currentProvider.isMetaMask
}

const getAccountFrom: Function = async (web3Provider): Promise<string | null> => {
  const accounts = await promisify(cb => web3Provider.eth.getAccounts(cb))

  return accounts && accounts.length > 0 ? accounts[0] : null
}

export const getProviderInfo: Function = async (): Promise<ProviderProps> => {
  if (typeof window.web3 === 'undefined') {
    return {
      name: '', available: false, loaded: false, account: '',
    }
  }

  // Use MetaMask's provider.
  web3 = new Web3(window.web3.currentProvider)
  // eslint-disable-next-line
  console.log('Injected web3 detected.')

  const name = isMetamask(web3) ? 'METAMASK' : 'UNKNOWN'
  const account = await getAccountFrom(web3)
  const available = account !== null

  return {
    name,
    available,
    loaded: true,
    account,
  }
}

export const getBalanceInEtherOf = async (safeAddress: string): Promise<string> => {
  const funds: BigNumber = await promisify(cb => web3.eth.getBalance(safeAddress, cb))
  if (!funds) {
    return '0'
  }

  return web3.fromWei(funds.toNumber(), 'ether').toString()
}
