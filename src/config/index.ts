import { ChainInfo, FEATURES, GasPriceOracle, GAS_PRICE_TYPE } from '@gnosis.pm/safe-react-gateway-sdk'
import memoize from 'lodash.memoize'
import { CHAIN_CONFIG_KEY } from 'src/logic/config/store/actions'
import { currentShortName } from 'src/logic/config/store/selectors'
import { store } from 'src/store'
import {
  APP_ENV,
  ETHERSCAN_API_KEY,
  GOOGLE_ANALYTICS_ID,
  INFURA_TOKEN,
  IS_PRODUCTION,
  NODE_ENV,
} from 'src/utils/constants'
import { loadFromSessionStorage } from 'src/utils/storage/session'
import { ETHEREUM_NETWORK, NETWORK_ID, SHORT_NAME } from './network.d'

export const getNetworks = (): ChainInfo[] => loadFromSessionStorage(CHAIN_CONFIG_KEY) || []

// Mainnet : Rinkeby
export const DEFAULT_NETWORK = IS_PRODUCTION ? '1' : '4'

// TODO: Move to currentSession.networkId instead of sessionStorage
export const NETWORK_ID_KEY = 'SAFE__networkId'
export const getInitialNetworkId = (): ETHEREUM_NETWORK => {
  const { pathname } = window.location

  const network = getNetworks().find(({ shortName }) => {
    return pathname.split('/').some((el) => el.startsWith(`${shortName}:`))
  })

  if (network?.chainId) {
    return network.chainId
  }

  return loadFromSessionStorage(NETWORK_ID_KEY) || DEFAULT_NETWORK
}

// May be able to make extraction of the shortName in URL a bit better
let networkId = getInitialNetworkId()

export const setNetworkId = (id: ETHEREUM_NETWORK): void => {
  networkId = id
}
export const getNetworkId = (): ETHEREUM_NETWORK => networkId

export const getChainName = (chainId: ETHEREUM_NETWORK = getNetworkId()): ChainInfo['chainName'] =>
  getNetworks().find((chain) => chain.chainId === chainId)?.chainName || ''

// FIXME: can be undefined
export const getChainInfoById = (chainId: ETHEREUM_NETWORK): ChainInfo =>
  getNetworks().find((chain) => chain.chainId === chainId)!

export const usesInfuraRPC = (): boolean =>
  [NETWORK_ID.MAINNET, NETWORK_ID.RINKEBY, NETWORK_ID.POLYGON].includes(getNetworkId() as NETWORK_ID)

export const getCurrentShortChainName = (): SHORT_NAME => currentShortName(store)

export const getShortNameById = (networkId = getNetworkId()): SHORT_NAME => getChainInfoById(networkId)?.shortName || ''

export const getChainIdByShortName = (shortName: SHORT_NAME): ETHEREUM_NETWORK =>
  getNetworks().find((network) => network.shortName === shortName)?.chainId || ''

export const getCurrentEnvironment = (): 'test' | 'production' | 'dev' => {
  switch (APP_ENV) {
    case 'test': {
      return 'test'
    }
    case 'production': {
      return 'production'
    }
    case 'dev':
    default: {
      // We need to check NODE_ENV calling jest outside of scripts
      return NODE_ENV === 'test' ? 'test' : 'dev'
    }
  }
}

// FIXME: Is not always defined
export const getChainInfo = (): ChainInfo => getNetworks().find((network) => network.chainId === getNetworkId())!

// FIXME: This should be added to CGW
export const getNativeCurrencyAddress = (): string => ''

export const getTxServiceUrl = (): ChainInfo['transactionService'] => getChainInfo()?.transactionService

// FIXME: Typescript error
export const getGasPriceOracles = (): GasPriceOracle[] =>
  //@ts-ignore
  getChainInfo()?.gasPrice?.filter(({ type }) => type === GAS_PRICE_TYPE.ORACLE)

// FIXME: Not sure if this is correct. We had a fixed gasPrice value before
export const getGasPrice = (): number => +getGasPriceOracles()[0].gweiFactor

export const getRpcServiceUrl = (): ChainInfo['rpcUri']['value'] =>
  usesInfuraRPC() ? `${getChainInfo()?.rpcUri.value}/${INFURA_TOKEN}` : getChainInfo()?.rpcUri.value

export const getSafeServiceBaseUrl = (safeAddress: string): ChainInfo['transactionService'] =>
  `${getTxServiceUrl()}/safes/${safeAddress}`

export const getTokensServiceBaseUrl = (): ChainInfo['transactionService'] => `${getTxServiceUrl()}/tokens`

/**
 * Checks if a particular feature is enabled in the current network configuration
 * @params {FEATURES} feature
 * @returns boolean
 */
export const isFeatureEnabled = (feature: FEATURES): boolean =>
  !!getChainInfo()?.features?.some((value) => value === feature)

export const getDisabledWallets = (): ChainInfo['disabledWallets'] => getChainInfo()?.disabledWallets || []

export const getGoogleAnalyticsTrackingID = (): string => GOOGLE_ANALYTICS_ID

const fetchContractABI = memoize(
  async (url: ChainInfo['blockExplorerUriTemplate']['api'], contractAddress: string, apiKey?: string) => {
    const apiUrl = url
      .replace('{{module}}', 'contract')
      .replace('{{action}}', 'getAbi')
      .replace('{{address}}', contractAddress)
      .replace(apiKey ? '{{apiKey}}' : '&apiKey={{apiKey}}', apiKey || '')

    const response = await fetch(apiUrl)

    if (!response.ok) {
      return { status: 0, result: [] }
    }

    return response.json()
  },
  (url, contractAddress) => `${url}_${contractAddress}`,
)

const getExporerUriTemplate = (): ChainInfo['blockExplorerUriTemplate'] => getChainInfo().blockExplorerUriTemplate

export const getExplorerUrl = (): string => {
  const { address } = getExporerUriTemplate()
  return address.replace('{{address}}', '')
}

const getExplorerApiKey = (blockExplorer: string): string | undefined =>
  blockExplorer.includes('etherscan') ? ETHERSCAN_API_KEY : undefined

// FIXME: Promise returns our ABI?
export const getContractABI = async (contractAddress: string): Promise<any> => {
  const { api } = getExporerUriTemplate()

  const apiKey = getExplorerApiKey(api)

  try {
    const { result, status } = await fetchContractABI(api, contractAddress, apiKey)

    if (status === '0') {
      return []
    }

    return result
  } catch (e) {
    console.error('Failed to retrieve ABI', e)
    return undefined
  }
}

export const getBlockExplorerInfo = (hash: string): string => {
  const { txHash, address } = getExporerUriTemplate()
  const isTx = hash.length > 42

  return isTx ? txHash.replace('{{hash}}', hash) : address.replace('{{address}}', hash)
}
