import Web3 from 'web3'
import { provider as Provider } from 'web3-core'
import { ContentHash } from 'web3-eth-ens'
import { sameAddress } from './ethAddresses'
import { EMPTY_DATA } from './ethTransactions'
import { ProviderProps } from './store/model/provider'
import { NODE_ENV } from 'src/utils/constants'
import { getRpcServiceUrl } from 'src/config'
import { isValidCryptoDomainName } from 'src/logic/wallets/ethAddresses'
import { getAddressFromUnstoppableDomain } from './utils/unstoppableDomains'

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
  WALLETLINK: 'WALLETLINK',
  AUTHEREUM: 'AUTHEREUM',
  LEDGER: 'LEDGER',
  TREZOR: 'TREZOR',
  LATTICE: 'LATTICE',
}

// With some wallets from web3connect you have to use their provider instance only for signing
// And our own one to fetch data
const httpProviderOptions = {
  timeout: 10_000,
}
export const web3ReadOnly = new Web3(
  process.env.NODE_ENV !== 'test'
    ? new Web3.providers.HttpProvider(getRpcServiceUrl(), httpProviderOptions)
    : 'ws://localhost:8545',
)

let web3 = web3ReadOnly
export const getWeb3 = (): Web3 => web3

export const resetWeb3 = (): void => {
  web3 = web3ReadOnly
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

export const getAddressFromDomain = (name: string): Promise<string> => {
  if (isValidCryptoDomainName(name)) {
    return getAddressFromUnstoppableDomain(name)
  }
  return web3.eth.ens.getAddress(name)
}

export const getContentFromENS = (name: string): Promise<ContentHash> => web3.eth.ens.getContenthash(name)

export const setWeb3 = (provider: Provider): void => {
  web3 = new Web3(provider)
}
