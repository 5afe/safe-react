import maticLogo from 'src/config/assets/token_matic.svg'
import { EnvironmentSettings, ETHEREUM_NETWORK, FEATURES, NetworkConfig, WALLETS } from 'src/config/networks/network.d'

const baseConfig: EnvironmentSettings = {
  clientGatewayUrl: 'https://safe-client-polygon.staging.gnosisdev.com/v1',
  txServiceUrl: 'https://safe-transaction-polygon.staging.gnosisdev.com/api/v1',
  safeUrl: 'https://polygon.gnosis-safe.io/app',
  gasPriceOracle: {
    url: 'https://gasstation-mainnet.matic.network',
    gasParameter: 'standard',
    gweiFactor: '1e9',
  },
  rpcServiceUrl: 'https://rpc-mainnet.matic.network',
  networkExplorerName: 'MainNet Matic Explorer',
  networkExplorerUrl: 'https://explorer-mainnet.maticvigil.com',
  networkExplorerApiUrl: 'https://api.polygonscan.com/api',
}

const polygon: NetworkConfig = {
  environment: {
    dev: {
      ...baseConfig,
      safeUrl: 'https://safe-team-polygon.staging.gnosisdev.com/app/',
    },
    staging: {
      ...baseConfig,
      safeUrl: 'https://safe-team-polygon.staging.gnosisdev.com/app/',
    },
    production: {
      ...baseConfig,
      clientGatewayUrl: 'https://safe-client.polygon.gnosis.io/v1',
      txServiceUrl: 'https://safe-transaction.polygon.gnosis.io/api/v1',
    },
  },
  network: {
    id: ETHEREUM_NETWORK.POLYGON,
    backgroundColor: '#8B50ED',
    textColor: '#ffffff',
    label: 'Polygon',
    isTestNet: false,
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
    WALLETS.WALLET_CONNECT,
    WALLETS.PORTIS,
  ],
  disabledFeatures: [FEATURES.DOMAIN_LOOKUP, FEATURES.SPENDING_LIMIT],
}

export default polygon
