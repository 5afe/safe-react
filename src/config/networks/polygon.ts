import maticLogo from 'src/config/assets/token_matic.svg'
import {
  EnvironmentSettings,
  ETHEREUM_LAYER,
  ETHEREUM_NETWORK,
  SHORT_NAME,
  FEATURES,
  NetworkConfig,
  WALLETS,
} from 'src/config/networks/network.d'

const baseConfig: EnvironmentSettings = {
  clientGatewayUrl: 'https://safe-client.staging.gnosisdev.com/v1',
  txServiceUrl: 'https://safe-transaction-polygon.staging.gnosisdev.com/api/v1',
  gasPriceOracles: [
    {
      url: 'https://gasstation-mainnet.matic.network',
      gasParameter: 'standard',
      gweiFactor: '1e9',
    },
  ],
  rpcServiceUrl: 'https://polygon-mainnet.infura.io/v3',
  safeAppsRpcServiceUrl: 'https://polygon-mainnet.infura.io/v3',
  networkExplorerName: 'MainNet Matic Explorer',
  networkExplorerUrl: 'https://explorer-mainnet.maticvigil.com',
  networkExplorerApiUrl: 'https://api.polygonscan.com/api',
}

const polygon: NetworkConfig = {
  environment: {
    test: baseConfig,
    dev: baseConfig,
    staging: baseConfig,
    production: {
      ...baseConfig,
      clientGatewayUrl: 'https://safe-client.gnosis.io/v1',
      txServiceUrl: 'https://safe-transaction.polygon.gnosis.io/api/v1',
    },
  },
  network: {
    id: ETHEREUM_NETWORK.POLYGON,
    shortName: SHORT_NAME.POLYGON,
    backgroundColor: '#8B50ED',
    textColor: '#ffffff',
    label: 'Polygon',
    ethereumLayer: ETHEREUM_LAYER.L2,
    nativeCoin: {
      address: '0x0000000000000000000000000000000000000000',
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
      logoUri: maticLogo,
    },
  },
  disabledWallets: [
    WALLETS.TREZOR,
    WALLETS.LEDGER,
    WALLETS.COINBASE,
    WALLETS.FORTMATIC,
    WALLETS.OPERA,
    WALLETS.OPERA_TOUCH,
    WALLETS.TORUS,
    WALLETS.TRUST,
    WALLETS.WALLET_LINK,
    WALLETS.AUTHEREUM,
    WALLETS.LATTICE,
    WALLETS.KEYSTONE,
    WALLETS.PORTIS,
  ],
  disabledFeatures: [FEATURES.DOMAIN_LOOKUP, FEATURES.SPENDING_LIMIT],
}

export default polygon
