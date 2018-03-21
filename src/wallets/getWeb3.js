// @flow
import Web3 from 'web3'
import type { ProviderProps } from '~/wallets/store/model/provider'

let web3
export const getWeb3 = () => web3

const isMetamask: Function = (web3Provider): boolean => {
  const isMetamaskConstructor = web3Provider.constructor.name === 'MetamaskInpageProvider'
  return isMetamaskConstructor || web3Provider.isMetaMask
}

const getAccountFrom: Function = async (web3Provider): Promise<string | null> => {
  const accounts = await web3Provider.eth.getAccounts()

  return accounts && accounts.length ? accounts[0] : null
}

export const getProviderInfo: Function = (): ProviderProps => {
  if (typeof window.web3 === 'undefined') {
    return { name: '', available: false, loaded: false }
  }

  // Use MetaMask's provider.
  web3 = new Web3(window.web3.currentProvider)
  // eslint-disable-next-line
  console.log('Injected web3 detected.')

  return {
    name: isMetamask(web3) ? 'METAMASK' : 'UNKNOWN',
    available: getAccountFrom(web3) !== null,
    loaded: true,
  }
}

export const promisify = (inner: Function): Promise<any> =>
  new Promise((resolve, reject) =>
    inner((err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    }))

export const ensureOnce = (fn: Function): Function => {
  let executed = false
  let response

  return (...args) => {
    if (executed) { return response }

    executed = true
    response = fn(args)

    return response
  }
}
