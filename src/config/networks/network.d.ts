// matches src/logic/tokens/store/model/token.ts `TokenProps` type
type Token = {
  address: string
  name: string
  symbol: string
  decimals: number
  logoUri?: string
}

export enum ETHEREUM_NETWORK {
  MAINNET = 1,
  MORDEN = 2,
  ROPSTEN = 3,
  RINKEBY = 4,
  GOERLI = 5,
  KOVAN = 42,
  XDAI = 100,
  ENERGY_WEB_CHAIN = 246,
  VOLTA = 73799,
  UNKNOWN = 0,
  LOCAL = 4447,
}

export type NetworkSettings = {
  // TODO: id now seems to be unnecessary
  id: ETHEREUM_NETWORK,
  color: string,
  label: string,
  isTestNet: boolean,
  nativeCoin: Token,
}

// something around this to display or not some critical sections in the app, depending on the network support
// I listed the ones that may conflict with the network.
// If non is present, all the sections are available.
export type SafeFeatures = {
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
