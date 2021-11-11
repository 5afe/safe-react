import Web3 from 'web3'
import { provider as Provider } from 'web3-core'
import { ContentHash } from 'web3-eth-ens'
import { Web3Adapter } from '@gnosis.pm/safe-core-sdk'

import { sameAddress } from './ethAddresses'
import { EMPTY_DATA } from './ethTransactions'
import { ProviderProps } from './store/model/provider'
import { getRpcServiceUrl, getNetworkId } from 'src/config'
import { isValidCryptoDomainName } from 'src/logic/wallets/ethAddresses'
import { getAddressFromUnstoppableDomain } from './utils/unstoppableDomains'
import { ETHEREUM_NETWORK } from 'src/config/networks/network'

// This providers have direct relation with name assigned in bnc-onboard configuration
export enum WALLET_PROVIDER {
  METAMASK = 'METAMASK',
  TORUS = 'TORUS',
  PORTIS = 'PORTIS',
  FORTMATIC = 'FORTMATIC',
  SQUARELINK = 'SQUARELINK',
  WALLETCONNECT = 'WALLETCONNECT',
  TRUST = 'TRUST',
  OPERA = 'OPERA',
  // This is the provider for WALLET_LINK configuration on bnc-onboard
  COINBASE_WALLET = 'COINBASE WALLET',
  AUTHEREUM = 'AUTHEREUM',
  LEDGER = 'LEDGER',
  TREZOR = 'TREZOR',
  LATTICE = 'LATTICE',
  KEYSTONE = 'KEYSTONE',
}

// With some wallets from web3connect you have to use their provider instance only for signing
// And our own one to fetch data
const httpProviderOptions = {
  timeout: 10_000,
}

const web3ReadOnly: Web3[] = []
export const getWeb3ReadOnly = (): Web3 => {
  if (!web3ReadOnly[getNetworkId()]) {
    web3ReadOnly[getNetworkId()] = new Web3(
      process.env.NODE_ENV !== 'test'
        ? new Web3.providers.HttpProvider(getRpcServiceUrl(), httpProviderOptions)
        : 'ws://localhost:8545',
    )
  }

  return web3ReadOnly[getNetworkId()]
}

let web3 = getWeb3ReadOnly()
export const getWeb3 = (): Web3 => web3
export const setWeb3 = (provider: Provider): void => {
  web3 = new Web3(provider)
}
export const resetWeb3 = (): void => {
  web3 = web3ReadOnly[getNetworkId()]
}

export const getAccountFrom = async (web3Provider: Web3): Promise<string | null> => {
  const accounts = await web3Provider.eth.getAccounts()
  return accounts && accounts.length > 0 ? accounts[0] : null
}

export const getNetworkIdFrom = (web3Provider: Web3): Promise<number> => web3Provider.eth.net.getId()

const isHardwareWallet = (walletName: string) =>
  sameAddress(WALLET_PROVIDER.LEDGER, walletName) || sameAddress(WALLET_PROVIDER.TREZOR, walletName)

export const isSmartContractWallet = async (web3Provider: Web3, account: string): Promise<boolean> => {
  if (!account) {
    return false
  }
  let contractCode = ''
  try {
    contractCode = await web3Provider.eth.getCode(account)
  } catch (e) {
    // ignore
  }
  return !!contractCode && contractCode.replace(EMPTY_DATA, '').replace(/0/g, '') !== ''
}

export const getProviderInfo = async (web3Instance: Web3, providerName = 'Wallet'): Promise<ProviderProps> => {
  const account = (await getAccountFrom(web3Instance)) || ''
  const network = await getNetworkIdFrom(web3Instance)
  const smartContractWallet = await isSmartContractWallet(web3Instance, account)
  const hardwareWallet = isHardwareWallet(providerName)
  const available = Boolean(account)

  return {
    name: providerName,
    available,
    loaded: true,
    account,
    network: network.toString() as ETHEREUM_NETWORK,
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

export const isTxPendingError = (err: Error): boolean => {
  const WEB3_TX_NOT_MINED_ERROR = 'Transaction was not mined within'
  return (err.message || '').startsWith(WEB3_TX_NOT_MINED_ERROR)
}

export const getSDKWeb3Adapter = (signerAddress: string): Web3Adapter => {
  return new Web3Adapter({
    web3: getWeb3(),
    signerAddress,
  })
}
