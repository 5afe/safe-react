import CeloLogo from 'src/config/assets/token_CELO.svg'
import {
  EnvironmentSettings,
  ETHEREUM_LAYER,
  ETHEREUM_NETWORK,
  NetworkConfig,
  WALLETS,
} from 'src/config/networks/network.d'

const baseConfig: EnvironmentSettings = {
  clientGatewayUrl: 'https://client-gateway.gnosis-safe-staging.celo-networks-dev.org/v1',
  txServiceUrl: 'https://transaction-service.gnosis-safe-staging.celo-networks-dev.org/api/v1',
  configServiceUrl: 'https://config-service.gnosis-safe-staging.celo-networks-dev.org/api/v1',
  safeUrl: 'https://alfajores.safe.celo.org',
  gasPriceOracles: [
    {
      url: 'https://www.gasnow.org/api/v3/gas/price?utm_source=:gnosis_safe',
      gasParameter: 'fast',
      gweiFactor: '1',
    },
    {
      url: 'https://ethgasstation.info/json/ethgasAPI.json',
      gasParameter: 'fast',
      gweiFactor: '1e8',
    },
  ],
  rpcServiceUrl: 'https://alfajores-forno.celo-testnet.org',
  safeAppsRpcServiceUrl: 'https://alfajores-forno.celo-testnet.org',
  networkExplorerName: 'Celo Explorer',
  networkExplorerUrl: 'https://alfajores-blockscout.celo-testnet.org/',
  networkExplorerApiUrl: 'https://alfajores-blockscout.celo-testnet.org/api',
}

const alfajores: NetworkConfig = {
  environment: {
    dev: {
      ...baseConfig,
    },
    staging: {
      ...baseConfig,
    },
    production: {
      ...baseConfig,
    },
  },
  network: {
    id: ETHEREUM_NETWORK.ALFAJORES,
    backgroundColor: '#FEF2D6',
    textColor: '#D8A11F',
    label: 'Alfajores',
    isTestNet: true,
    ethereumLayer: ETHEREUM_LAYER.L1,
    nativeCoin: {
      address: '0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9',
      name: 'Celo (Alfajores)',
      symbol: 'CELO',
      decimals: 18,
      logoUri: CeloLogo,
    },
  },
  disabledWallets: [WALLETS.FORTMATIC],
}

export default alfajores
