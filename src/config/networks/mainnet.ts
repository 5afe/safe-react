import EtherLogo from 'src/config/assets/token_eth.svg'
import { EnvironmentSettings, ETHEREUM_LAYER, ETHEREUM_NETWORK, NetworkConfig } from 'src/config/networks/network.d'

const baseConfig: EnvironmentSettings = {
  clientGatewayUrl: 'https://client-gateway.celo-safe.io/v1',
  txServiceUrl: 'https://transaction-service.celo-safe.io/api/v1',
  safeUrl: 'https://gnosis-safe.io/app',
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
  safeAppsRpcServiceUrl: 'https://mainnet.infura.io:443/v3',
  rpcServiceUrl: 'https://mainnet.infura.io:443/v3',
  networkExplorerName: 'Blockscout',
  networkExplorerUrl: 'https://explorer.celo.org',
  networkExplorerApiUrl: 'https://explorer.celo.org/api',
}

const mainnet: NetworkConfig = {
  environment: {
    dev: {
      ...baseConfig,
      safeUrl: 'https://safe-team-mainnet.staging.gnosisdev.com/app/',
    },
    staging: {
      ...baseConfig,
      safeUrl: 'https://safe-team-mainnet.staging.gnosisdev.com/app/',
    },
    production: {
      ...baseConfig,
      clientGatewayUrl: 'https://safe-client.gnosis.io/v1',
      txServiceUrl: 'https://safe-transaction.mainnet.gnosis.io/api/v1',
    },
  },
  network: {
    id: ETHEREUM_NETWORK.MAINNET,
    backgroundColor: '#FBCC5C',
    textColor: '#111214',
    label: 'Celo Mainnet',
    isTestNet: false,
    ethereumLayer: ETHEREUM_LAYER.L1,
    nativeCoin: {
      address: '0x0000000000000000000000000000000000000000',
      name: 'Celo',
      symbol: 'CELO',
      decimals: 18,
      logoUri: EtherLogo,
    },
  },
}

export default mainnet
