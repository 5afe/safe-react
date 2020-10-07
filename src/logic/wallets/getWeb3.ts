import Web3 from 'web3'

import { sameAddress } from './ethAddresses'
import { EMPTY_DATA } from './ethTransactions'
import { ProviderProps } from './store/model/provider'
import { NODE_ENV } from 'src/utils/constants'

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

export const getAccountFrom = async (web3Provider: Web3): Promise<string | null> => {
  const accounts = await web3Provider.eth.getAccounts()

  if (NODE_ENV === 'test' && window.testAccountIndex) {
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
