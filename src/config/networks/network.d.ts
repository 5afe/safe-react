import { ETHEREUM_NETWORK } from 'src/logic/wallets/getWeb3'

type DisplayFlag = 'enable' | 'disable'

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
  safeApps?: DisplayFlag,
  collectibles?: DisplayFlag,
  contractInteraction?: DisplayFlag
}

type GasPrice = {
  gasPrice: number
  gasPriceOracleUri?: string
} | {
  gasPrice?: number
  // for infura there's a REST API Token required stored in: `REACT_APP_INFURA_TOKEN`
  gasPriceOracleUri: string
}

export type EnvironmentSettings = GasPrice & {
  txServiceUri: string
  // Shall we keep a reference to the relay?
  relayApiUri?: string
  safeAppsUri: string
  rpcServiceUri: string
  networkExplorerUri: string
  networkExplorerApiUri: string
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
