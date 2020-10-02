import { ETHEREUM_NETWORK } from 'src/logic/wallets/getWeb3'

// matches src/logic/tokens/store/model/token.ts `TokenProps` type
type Token = {
  address: string
  name: string
  symbol: string
  decimals: number
  logoUri?: string
}

type NetworkSettings = {
  id: ETHEREUM_NETWORK,
  color: string,
  label: string,
  nativeCoin: Token,
}

// something around this to display or not some critical sections in the app, depending on the network support
// I listed the ones that may conflict with the network.
// If non is present, all the sections are available.
type SafeFeatures = {
  safeApps?: boolean,
  collectibles?: boolean,
  contractInteraction?: boolean
}

type GasPrice = {
  gasPrice: number
  gasPriceOracleUrl?: string
} | {
  gasPrice?: number
  // for infura there's a REST API Token required stored in: `REACT_APP_INFURA_TOKEN`
  gasPriceOracleUrl: string
}

export type EnvironmentSettings = GasPrice & {
  txServiceUrl: string
  // Shall we keep a reference to the relay?
  relayApiUrl?: string
  safeAppsUrl: string
  rpcServiceUrl: string
  networkExplorerName: string
  networkExplorerUrl: string
  networkExplorerApiUrl: string
}

type SafeEnvironments = {
  dev?: EnvironmentSettings
  staging?: EnvironmentSettings
  production: EnvironmentSettings
}

export interface NetworkConfig {
  network: NetworkSettings
  features?: SafeFeatures
  environment: SafeEnvironments
}
