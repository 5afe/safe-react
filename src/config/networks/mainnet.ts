import CeloLogo from 'src/config/assets/token_CELO.svg'
import { EnvironmentSettings, ETHEREUM_LAYER, ETHEREUM_NETWORK, NetworkConfig } from 'src/config/networks/network.d'

const baseConfig: EnvironmentSettings = {
  clientGatewayUrl: 'https://client-gateway.celo-safe.io/v1',
  txServiceUrl: 'https://transaction-service.celo-safe.io/api/v1',
  safeUrl: 'https://safe.celo.org',
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
  safeAppsRpcServiceUrl: 'https://forno.celo.org',
  rpcServiceUrl: 'https://forno.celo.org',
  networkExplorerName: 'Blockscout',
  networkExplorerUrl: 'https://explorer.celo.org',
  networkExplorerApiUrl: 'https://explorer.celo.org/api',
}

const mainnet: NetworkConfig = {
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
    id: ETHEREUM_NETWORK.MAINNET,
    backgroundColor: '#F8F9F9',
    textColor: '#1AB775',
    label: 'Celo Mainnet',
    isTestNet: false,
    ethereumLayer: ETHEREUM_LAYER.L1,
    nativeCoin: {
      address: '0x471EcE3750Da237f93B8E339c536989b8978a438',
      name: 'Celo',
      symbol: 'CELO',
      decimals: 18,
      logoUri: CeloLogo,
    },
  },
}

export default mainnet
