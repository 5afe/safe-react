import memoize from 'lodash.memoize'
import Web3 from 'web3'
import { provider as Provider } from 'web3-core'
import { ContentHash } from 'web3-eth-ens'

import networks from 'src/config/networks'
import { EnvironmentSettings, ETHEREUM_NETWORK, NetworkSettings, SafeFeatures } from 'src/config/networks/network.d'
import { checksumAddress } from 'src/utils/checksumAddress'
import { APP_ENV, ETHERSCAN_API_KEY, GOOGLE_ANALYTICS_ID, INFURA_TOKEN, NETWORK, NODE_ENV } from 'src/utils/constants'
import { ensureOnce } from 'src/utils/singleton'

export const getNetworkId = (): ETHEREUM_NETWORK => ETHEREUM_NETWORK[NETWORK]

export const getNetworkName = (): string => ETHEREUM_NETWORK[getNetworkId()]

const getCurrentEnvironment = (): string => {
  switch (NODE_ENV) {
    case 'test': {
      return 'test'
    }
    case 'production': {
      return APP_ENV === 'production' ? 'production' : 'staging'
    }
    default: {
      return 'dev'
    }
  }
}

type NetworkSpecificConfiguration = EnvironmentSettings & {
  network: NetworkSettings,
  features?: SafeFeatures,
}

const configuration = (): NetworkSpecificConfiguration => {
  const currentEnvironment = getCurrentEnvironment()

  // special case for test environment
  if (currentEnvironment === 'test') {
    const configFile = networks.local

    return {
      ...configFile.environment.production,
      network: configFile.network,
      features: configFile.features,
    }
  }

  // lookup the config file based on the network specified in the NETWORK variable
  const configFile = networks[getNetworkName().toLowerCase()]
  // defaults to 'production' as it's the only environment that is required for the network configs
  const networkBaseConfig = configFile.environment[currentEnvironment] ?? configFile.environment.production

  return {
    ...networkBaseConfig,
    network: configFile.network,
    features: configFile.features,
  }
}

const getConfig: () => NetworkSpecificConfiguration = ensureOnce(configuration)

export const getTxServiceUrl = (): string => getConfig()?.txServiceUrl

export const getRelayUrl = (): string | undefined => getConfig()?.relayApiUrl

export const getGnosisSafeAppsUrl = (): string => getConfig()?.safeAppsUrl

export const getRpcServiceUrl = (): string => {
  const usesInfuraRPC = [ETHEREUM_NETWORK.MAINNET, ETHEREUM_NETWORK.RINKEBY].includes(getNetworkId())

  if (usesInfuraRPC) {
    return getConfig()?.rpcServiceUrl + INFURA_TOKEN
  }

  return getConfig()?.rpcServiceUrl
}

export const getNetworkExplorerInfo = (): { name: string; url: string; apiUrl: string } => ({
  name: getConfig()?.networkExplorerName,
  url: getConfig()?.networkExplorerUrl,
  apiUrl: getConfig()?.networkExplorerApiUrl,
})

export const getNetworkConfigFeatures = (): SafeFeatures | undefined => getConfig()?.features

export const getNetworkInfo = (): NetworkSettings => getConfig()?.network

export const getTxServiceUriFrom = (safeAddress: string) => `safes/${safeAddress}/transactions/`

export const getIncomingTxServiceUriTo = (safeAddress: string) => `safes/${safeAddress}/incoming-transfers/`

export const getAllTransactionsUriFrom = (safeAddress: string) => `safes/${safeAddress}/all-transactions/`

export const getSafeCreationTxUri = (safeAddress: string) => `safes/${safeAddress}/creation/`

export const getGoogleAnalyticsTrackingID = (): string => GOOGLE_ANALYTICS_ID[getNetworkId()]

export const buildSafeCreationTxUrl = (safeAddress: string) => {
  const host = getTxServiceUrl()
  const address = checksumAddress(safeAddress)
  const base = getSafeCreationTxUri(address)

  return `${host}${base}`
}

const fetchContractABI = memoize(
  async (url: string, contractAddress: string, apiKey?: string) => {
    let params: any = {
      module: 'contract',
      action: 'getAbi',
      address: contractAddress,
    }

    if (apiKey) {
      params = { ...params, apiKey }
    }

    const response = await fetch(`${url}?${new URLSearchParams(params)}`)

    if (!response.ok) {
      return { status: 0, result: [] }
    }

    return response.json()
  },
  (url, contractAddress) => `${url}_${contractAddress}`,
)

const getNetworkExplorerApiKey = (networkExplorerName: string): string | undefined=> {
  switch (networkExplorerName.toLowerCase()) {
    case 'etherscan': {
      return  ETHERSCAN_API_KEY
    }
    default: {
      return undefined
    }
  }
}

export const getContractABI = async (contractAddress: string)  =>{
  const { apiUrl, name } = getNetworkExplorerInfo()

  const apiKey = getNetworkExplorerApiKey(name)

  try {
    const { result, status } = await fetchContractABI(apiUrl, contractAddress, apiKey)

    if (status === '0') {
      return []
    }

    return result
  } catch (e) {
    console.error('Failed to retrieve ABI', e)
    return undefined
  }
}

export type BlockScanInfo = () => {
  alt: string
  url: string
}

export const getExplorerInfo = (hash: string): BlockScanInfo => {
  const { name, url } = getNetworkExplorerInfo()

  const blockScanInfo = () => {
    const type = hash.length > 42 ? 'tx' : 'address'

    return  {
      url: `${url}${type}/${hash}`,
      alt:  name || '',
    }
  }

  return blockScanInfo
}

// With some wallets from web3connect you have to use their provider instance only for signing
// And our own one to fetch data
export const web3ReadOnly = new Web3(
  process.env.NODE_ENV !== 'test'
    ? new Web3.providers.HttpProvider(getRpcServiceUrl())
    : window.web3?.currentProvider || 'ws://localhost:8545',
)

let web3 = web3ReadOnly
export const getWeb3 = (): Web3 => web3

export const resetWeb3 = (): void => {
  web3 = web3ReadOnly
}

export const setWeb3 = (provider: Provider): void => {
  web3 = new Web3(provider)
}

export const getBalanceInEtherOf = async (safeAddress: string): Promise<string> => {
  if (!web3) {
    return '0'
  }

  const funds = await web3.eth.getBalance(safeAddress)

  if (!funds) {
    return '0'
  }

  return web3.utils.fromWei(funds, 'ether').toString()
}

export const getAddressFromENS = (name: string): Promise<string> => web3.eth.ens.getAddress(name)

export const getContentFromENS = (name: string): Promise<ContentHash> => web3.eth.ens.getContenthash(name)
