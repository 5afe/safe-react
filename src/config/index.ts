import { ExplorerButton } from '@gnosis.pm/safe-react-components'
import { ChainInfo, GasPriceOracle, GAS_PRICE_TYPE, FEATURES } from '@gnosis.pm/safe-react-gateway-sdk'

import { emptyChainInfo, _chains } from 'src/logic/config/store/reducer'
import { DEFAULT_CHAIN_ID, ETHERSCAN_API_KEY, INFURA_TOKEN, SAFE_APPS_RPC_TOKEN } from 'src/utils/constants'

export type ChainId = ChainInfo['chainId']
type ChainName = ChainInfo['chainName']
export type ShortName = ChainInfo['shortName']

// Local reference in order to reference network ids often
export const CHAIN_ID: Record<ChainName, ChainId> = {
  UNKNOWN: '0',
  MAINNET: '1',
  MORDEN: '2',
  ROPSTEN: '3',
  RINKEBY: '4',
  GOERLI: '5',
  OPTIMISM: '10',
  KOVAN: '42',
  BSC: '56',
  XDAI: '100',
  POLYGON: '137',
  ENERGY_WEB_CHAIN: '246',
  LOCAL: '4447',
  ARBITRUM: '42161',
  AVALANCHE: '43114',
  VOLTA: '73799',
}

// The values match that required of onboard
export enum WALLETS {
  METAMASK = 'metamask',
  WALLET_CONNECT = 'walletConnect',
  TREZOR = 'trezor',
  LEDGER = 'ledger',
  TRUST = 'trust',
  FORTMATIC = 'fortmatic',
  PORTIS = 'portis',
  AUTHEREUM = 'authereum',
  TORUS = 'torus',
  COINBASE = 'coinbase',
  WALLET_LINK = 'walletLink',
  OPERA = 'opera',
  OPERA_TOUCH = 'operaTouch',
  LATTICE = 'lattice',
  KEYSTONE = 'keystone',
}

export enum SAFE_FEATURES {
  SAFE_TX_GAS_OPTIONAL = 'SAFE_TX_GAS_OPTIONAL',
}

// =========================================================================

export const getChains = (): ChainInfo[] => _chains

export const isValidChainId = (chainId: unknown): chainId is ChainId =>
  getChains().some((chain) => chain.chainId === chainId)

export const getInitialChainId = () => {
  const localConfig = localStorage.getItem('SAFE__config')

  try {
    return localConfig ? JSON.parse(localConfig)?.chainId : DEFAULT_CHAIN_ID
  } catch {
    return DEFAULT_CHAIN_ID
  }
}

let _chainId = getInitialChainId()

export const _setChainId = (newChainId: ChainId) => {
  _chainId = newChainId
}

export const _getChainId = (): ChainId => {
  return _chainId
}

export const getChainById = (chainId: ChainId): ChainInfo => {
  return getChains().find((chain) => chain.chainId === chainId) || emptyChainInfo
}

export const getChainInfo = (): ChainInfo => {
  return getChains().find((chain) => chain.chainId === _getChainId()) || emptyChainInfo
}

export const getChainName = (): ChainName => {
  return getChainInfo().chainName
}

export const getShortName = (): ShortName => {
  return getChainInfo().shortName
}

const usesInfuraRPC = (): boolean => [CHAIN_ID.MAINNET, CHAIN_ID.RINKEBY, CHAIN_ID.POLYGON].includes(_getChainId())

export const getRpcServiceUrl = (): string => {
  const { rpcUri } = getChainInfo()
  return usesInfuraRPC() && INFURA_TOKEN ? `${rpcUri.value}/${INFURA_TOKEN}` : rpcUri.value
}

export const getSafeAppsRpcServiceUrl = (): string => {
  const { safeAppsRpcUri } = getChainInfo()
  return usesInfuraRPC() && SAFE_APPS_RPC_TOKEN
    ? `${safeAppsRpcUri.value}/${SAFE_APPS_RPC_TOKEN}`
    : safeAppsRpcUri.value
}

export const getGasPriceOracles = (): Extract<ChainInfo['gasPrice'][number], GasPriceOracle>[] => {
  const isOracleType = (gasPrice: ChainInfo['gasPrice'][number]): gasPrice is GasPriceOracle => {
    return gasPrice.type === GAS_PRICE_TYPE.ORACLE
  }

  return getChainInfo().gasPrice.filter(isOracleType)
}

export const getTxServiceUrl = (): ChainInfo['transactionService'] => {
  return getChainInfo().transactionService
}

export const getTokensServiceUrl = (): string => {
  return `${getTxServiceUrl()}/tokens`
}

export const getSafeServiceBaseUrl = (safeAddress: string): string => {
  return `${getTxServiceUrl()}/safes/${safeAddress}`
}

export const getDisabledWallets = (): ChainInfo['disabledWallets'] => {
  return getChainInfo().disabledWallets
}

const getExplorerUriTemplate = (): ChainInfo['blockExplorerUriTemplate'] => {
  return getChainInfo().blockExplorerUriTemplate
}

export const getExplorerUrl = (): string => {
  const { address } = getExplorerUriTemplate()
  return new URL(address).origin
}

export const getHashedExplorerUrl = (hash: string): string => {
  const { address, txHash } = getExplorerUriTemplate()
  const isTx = hash.length > 42

  return isTx ? txHash.replace('{{hash}}', hash) : address.replace('{{address}}', hash)
}

// ExplorerInfo return type is not exported by SRC
export const getExplorerInfo = (hash: string): Parameters<typeof ExplorerButton>[0]['explorerUrl'] => {
  const url = getHashedExplorerUrl(hash)

  const { hostname } = new URL(url)
  const alt = `View on ${hostname}` // Not returned by CGW
  return () => ({ url, alt })
}

export const isFeatureEnabled = (feature: FEATURES | SAFE_FEATURES) => {
  return (
    getChainInfo().features.includes(feature as FEATURES) ||
    Object.values(SAFE_FEATURES).includes(feature as SAFE_FEATURES)
  )
}

const getExplorerApiKey = (apiUrl: string): string | undefined => {
  return apiUrl.includes('etherscan') && ETHERSCAN_API_KEY ? ETHERSCAN_API_KEY : undefined
}

const fetchContractAbi = async (contractAddress: string) => {
  // Remove search params
  const [apiUrl] = getExplorerUriTemplate().api.split('?')
  const apiKey = getExplorerApiKey(apiUrl)

  const params: Record<string, string> = {
    module: 'contract',
    action: 'getAbi',
    address: contractAddress,
    ...(apiKey && { apiKey }),
  }

  const response = await fetch(`${apiUrl}?${new URLSearchParams(params)}`)

  if (!response.ok) {
    return { status: 0, result: [] }
  }

  return response.json()
}

export const getContractABI = async (contractAddress: string) => {
  try {
    const { result, status } = await fetchContractAbi(contractAddress)

    if (status === '0') {
      return []
    }

    return result
  } catch (e) {
    console.error('Failed to retrieve ABI', e)
    return undefined
  }
}
