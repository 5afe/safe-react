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
  ID: number,
  COLOR: string,
  LABEL: string,
  NATIVE_COIN: Token,
}

// something around this to display or not some critical sections in the app, depending on the network support
// I listed the ones that may conflict with the network.
// If non is present, all the sections are available.
type SafeFeatures = {
  SAFE_APPS?: DisplayFlag,
  COLLECTIBLES?: DisplayFlag,
  CONTRACT_INTERACTION?: DisplayFlag
}

type GasPrice = {
  GAS_PRICE: number
  GAS_PRICE_ORACLE_URL?: string
} | {
  GAS_PRICE?: number
  // for infura there's a REST API Token required stored in: `REACT_APP_INFURA_TOKEN`
  GAS_PRICE_ORACLE_URL: string
}

export type EnvironmentSettings = GasPrice & {
  TX_SERVICE_HOST: string
  // Shall we keep a reference to the relay?
  RELAY_API_URL?: string
  SAFE_APPS_URL: string
  RPC_SERVICE_URL: string
  NETWORK_EXPLORER_URL: string
  NETWORK_EXPLORER_API_URL: string
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
