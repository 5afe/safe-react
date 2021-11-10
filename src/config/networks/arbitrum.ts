import AethLogo from 'src/config/assets/token_aeth.svg'
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
  txServiceUrl: 'https://safe-transaction.arbitrum.gnosis.io/api/v1',
  gasPrice: 2e9,
  rpcServiceUrl: 'https://arb1.arbitrum.io/rpc',
  safeAppsRpcServiceUrl: 'https://arb1.arbitrum.io/rpc',
  networkExplorerName: 'Arbitrum explorer',
  networkExplorerUrl: 'https://arbiscan.io',
  networkExplorerApiUrl: 'https://api.arbiscan.io/api',
}

const arbitrum: NetworkConfig = {
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
    id: ETHEREUM_NETWORK.ARBITRUM,
    shortName: SHORT_NAME.ARBITRUM,
    backgroundColor: '#2A3245',
    textColor: '#ffffff',
    label: 'Arbitrum',
    ethereumLayer: ETHEREUM_LAYER.L2,
    nativeCoin: {
      address: '0x0000000000000000000000000000000000000000',
      name: 'AETH',
      symbol: 'AETH',
      decimals: 18,
      logoUri: AethLogo,
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

export default arbitrum
