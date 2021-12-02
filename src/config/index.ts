import {
  ChainInfo,
  GasPriceOracle,
  GAS_PRICE_TYPE,
  FEATURES,
  RPC_AUTHENTICATION,
  RpcUri,
} from '@gnosis.pm/safe-react-gateway-sdk'
import { CONFIG_REDUCER_ID, initialConfigState } from 'src/logic/config/store/reducer'

import {
  ETHERSCAN_API_KEY,
  INFURA_TOKEN,
  LS_NAMESPACE,
  LS_SEPARATOR,
  SAFE_APPS_RPC_TOKEN,
  TX_SERVICE_VERSION,
} from 'src/utils/constants'
import { ChainId, ChainName, SAFE_FEATURES, ShortName } from './chain.d'
import { emptyChainInfo, getChains } from './cache/chains'

export const getInitialChainId = () => {
  const LOCAL_CONFIG_KEY = `${LS_NAMESPACE}${LS_SEPARATOR}${CONFIG_REDUCER_ID}`
  const DEFAULT_CHAIN_ID = initialConfigState.chainId

  const localChainId = localStorage.getItem(LOCAL_CONFIG_KEY)

  try {
    return localChainId ? JSON.parse(localChainId)?.chainId : DEFAULT_CHAIN_ID
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

export const isValidChainId = (chainId: unknown): chainId is ChainId =>
  getChains().some((chain) => chain.chainId === chainId)

export const getChainById = (chainId: ChainId): ChainInfo => {
  return getChains().find((chain) => chain.chainId === chainId) || emptyChainInfo
}

export const getChainInfo = (): ChainInfo => {
  return getChainById(_getChainId())
}

export const getChainName = (): ChainName => {
  return getChainInfo().chainName
}

export const getShortName = (): ShortName => {
  return getChainInfo().shortName
}

// CGW does not return `nativeCurrency.address` as it is `ZERO_ADDRESS`
export const getNativeCurrency = (): ChainInfo['nativeCurrency'] => {
  return getChainInfo().nativeCurrency
}

const formatRpcServiceUrl = ({ authentication, value }: RpcUri, TOKEN: string): string => {
  const usesInfuraRPC = authentication === RPC_AUTHENTICATION.API_KEY_PATH
  return usesInfuraRPC && TOKEN ? `${value}${TOKEN}` : value
}

export const getRpcServiceUrl = (): string => {
  const { rpcUri } = getChainInfo()
  return formatRpcServiceUrl(rpcUri, INFURA_TOKEN)
}

export const getSafeAppsRpcServiceUrl = (): string => {
  const { safeAppsRpcUri } = getChainInfo()
  return formatRpcServiceUrl(safeAppsRpcUri, SAFE_APPS_RPC_TOKEN)
}

export const getGasPriceOracles = (): Extract<ChainInfo['gasPrice'][number], GasPriceOracle>[] => {
  const isOracleType = (gasPrice: ChainInfo['gasPrice'][number]): gasPrice is GasPriceOracle => {
    return gasPrice.type === GAS_PRICE_TYPE.ORACLE
  }

  return getChainInfo().gasPrice.filter(isOracleType)
}

export const getTxServiceUrl = (): ChainInfo['transactionService'] => {
  const { transactionService } = getChainInfo()
  // To avoid breaking changes, we define the version the web uses manually
  return `${transactionService}/api/v${TX_SERVICE_VERSION}`
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

// Matches return type of ExplorerInfo from SRC
export const getExplorerInfo = (hash: string): (() => { url: string; alt: string }) => {
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
