import {
  ChainInfo,
  GasPriceOracle,
  GAS_PRICE_TYPE,
  RPC_AUTHENTICATION,
  RpcUri,
  GasPriceFixed,
} from '@gnosis.pm/safe-react-gateway-sdk'

import {
  DEFAULT_CHAIN_ID,
  ETHERSCAN_API_KEY,
  INFURA_TOKEN,
  SAFE_APPS_RPC_TOKEN,
  TX_SERVICE_VERSION,
} from 'src/utils/constants'
import { ChainId, ChainName, ShortName } from './chain.d'
import { emptyChainInfo, getChains } from './cache/chains'
import { evalTemplate } from './utils'
import local from 'src/utils/storage/local'
import { ConfigState } from 'src/logic/config/store/reducer/reducer.d'

export const LOCAL_CONFIG_KEY = 'config'

/**
 * Determine the initial chain id
 */
const getInitialChainId = (): ChainId => {
  const localItem = local.getItem<ConfigState>(LOCAL_CONFIG_KEY)
  return localItem?.chainId || DEFAULT_CHAIN_ID
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
  const needsToken = authentication === RPC_AUTHENTICATION.API_KEY_PATH
  return needsToken ? `${value}${TOKEN}` : value
}

export const getRpcServiceUrl = (rpcUri = getChainInfo().rpcUri): string => {
  return formatRpcServiceUrl(rpcUri, INFURA_TOKEN)
}

export const getPublicRpcUrl = (): string => {
  const { publicRpcUri } = getChainInfo()
  // Don't pass any auth token because this RPC is for user's wallet
  return formatRpcServiceUrl(publicRpcUri, '')
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

export const getFixedGasPrice = (): Extract<ChainInfo['gasPrice'][number], GasPriceFixed> => {
  const isFixed = (gasPrice: ChainInfo['gasPrice'][number]): gasPrice is GasPriceFixed => {
    return gasPrice.type === GAS_PRICE_TYPE.FIXED
  }
  return getChainInfo().gasPrice.filter(isFixed)[0]
}

// @TODO: Remove after Safe Apps reliance
export const getTxServiceUrl = (): ChainInfo['transactionService'] => {
  const { transactionService } = getChainInfo()
  // To avoid breaking changes, we define the version the web uses manually
  return `${transactionService}/api/v${TX_SERVICE_VERSION}`
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
  const isTx = hash.length > 42
  const param = isTx ? 'txHash' : 'address'
  const uri = getExplorerUriTemplate()[param]
  return evalTemplate(uri, { [param]: hash })
}

// Matches return type of ExplorerInfo from SRC
export const getExplorerInfo = (hash: string): (() => { url: string; alt: string }) => {
  const url = getHashedExplorerUrl(hash)

  const { hostname } = new URL(url)
  const alt = `View on ${hostname}` // Not returned by CGW
  return () => ({ url, alt })
}

const getExplorerApiKey = (apiUrl: string): string | undefined => {
  return apiUrl.includes('etherscan') && ETHERSCAN_API_KEY ? ETHERSCAN_API_KEY : undefined
}

const fetchContractAbi = async (contractAddress: string) => {
  const apiUri = getExplorerUriTemplate().api
  const apiKey = getExplorerApiKey(apiUri)

  const params = {
    module: 'contract',
    action: 'getAbi',
    address: contractAddress,
    ...(apiKey && { apiKey }),
  }

  const finalUrl = evalTemplate(apiUri, params)

  const response = await fetch(finalUrl)

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
