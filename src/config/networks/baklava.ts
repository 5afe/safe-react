import EtherLogo from 'src/config/assets/token_eth.svg'
import {
  EnvironmentSettings,
  ETHEREUM_LAYER,
  ETHEREUM_NETWORK,
  NetworkConfig,
  WALLETS,
} from 'src/config/networks/network.d'

const baseConfig: EnvironmentSettings = {
  clientGatewayUrl: 'https://client-gateway.celo-safe.io/v1',
  txServiceUrl: 'https://transaction-service.celo-safe.io/api/v1',
  safeUrl: 'https://baklava.safe.celo.org',
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
  rpcServiceUrl: 'https://baklava-forno.celo-testnet.org',
  safeAppsRpcServiceUrl: 'https://baklava-forno.celo-testnet.org',
  networkExplorerName: 'Celo Baklava Explorer',
  networkExplorerUrl: 'https://baklava-blockscout.celo-testnet.org/',
  networkExplorerApiUrl: 'https://baklava-blockscout.celo-testnet.org/api',
}

const baklava: NetworkConfig = {
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
    id: ETHEREUM_NETWORK.BAKLAVA,
    backgroundColor: '#F8F9F9',
    textColor: '#3488EC',
    label: 'Baklava',
    isTestNet: true,
    ethereumLayer: ETHEREUM_LAYER.L1,
    nativeCoin: {
      address: '0x0000000000000000000000000000000000000000',
      name: 'Celo',
      symbol: 'CELO',
      decimals: 18,
      logoUri: EtherLogo,
    },
  },
  disabledWallets: [WALLETS.FORTMATIC],
}

export default baklava
