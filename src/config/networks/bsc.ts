import BnbLogo from 'src/config/assets/token_bnb.svg'
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
  clientGatewayUrl: 'https://safe-client.gnosis.io/v1',
  txServiceUrl: 'https://safe-transaction.bsc.gnosis.io/api/v1',
  gasPrice: 5e9,
  rpcServiceUrl: 'https://bsc-dataseed.binance.org',
  safeAppsRpcServiceUrl: 'https://bsc-dataseed.binance.org',
  networkExplorerName: 'BscScan',
  networkExplorerUrl: 'https://www.bscscan.com',
  networkExplorerApiUrl: 'https://api.bscscan.com/api',
}

const bsc: NetworkConfig = {
  environment: {
    test: baseConfig,
    dev: baseConfig,
    staging: baseConfig,
    production: baseConfig,
  },
  network: {
    id: ETHEREUM_NETWORK.BSC,
    shortName: SHORT_NAME.BSC,
    backgroundColor: '#d0980b',
    textColor: '#ffffff',
    label: 'BSC',
    ethereumLayer: ETHEREUM_LAYER.L2,
    nativeCoin: {
      address: '0x0000000000000000000000000000000000000000',
      name: 'Binance Coin',
      symbol: 'BNB',
      decimals: 18,
      logoUri: BnbLogo,
    },
  },
  disabledWallets: [
    WALLETS.TREZOR,
    WALLETS.LEDGER,
    WALLETS.COINBASE,
    WALLETS.FORTMATIC,
    WALLETS.OPERA,
    WALLETS.OPERA_TOUCH,
    WALLETS.PORTIS,
    WALLETS.TORUS,
    WALLETS.TRUST,
    WALLETS.WALLET_LINK,
    WALLETS.AUTHEREUM,
    WALLETS.LATTICE,
    WALLETS.KEYSTONE,
  ],
  disabledFeatures: [FEATURES.DOMAIN_LOOKUP, FEATURES.SPENDING_LIMIT],
}

export default bsc
