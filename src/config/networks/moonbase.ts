import devLogo from 'src/config/assets/token_eth.svg'
import { EnvironmentSettings, ETHEREUM_NETWORK, FEATURES, NetworkConfig, WALLETS } from 'src/config/networks/network.d'

const baseConfig: EnvironmentSettings = {
  clientGatewayUrl: 'https://client.testnet.moonbeam.network/v1/chains/',
  txServiceUrl: 'https://client.testnet.moonbeam.network/safe-transaction-service/api/v1/about/',
  safeUrl: 'https://alpha-safe-react.s3-website-us-west-1.amazonaws.com/',
  gasPrice: 1e9,
  rpcServiceUrl: 'https://rpc.testnet.moonbeam.network',
  safeAppsRpcServiceUrl: 'https://rpc.testnet.moonbeam.network',
  networkExplorerName: 'Blockscout Moonbase DEV Explorer',
  networkExplorerUrl: 'https://moonbase-blockscout.testnet.moonbeam.network/',
  networkExplorerApiUrl: 'https://moonbase-blockscout.testnet.moonbeam.network/api',
}

const moonbase: NetworkConfig = {
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
    id: ETHEREUM_NETWORK.MOONBASE,
    backgroundColor: '#8B50ED',
    textColor: '#ffffff',
    label: 'Moonbase',
    isTestNet: false,
    nativeCoin: {
      address: '0x0000000000000000000000000000000000000000',
      name: 'DEV',
      symbol: 'DEV',
      decimals: 18,
      logoUri: devLogo,
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
    WALLETS.PORTIS,
  ],
  disabledFeatures: [FEATURES.DOMAIN_LOOKUP, FEATURES.SPENDING_LIMIT],
}

export default moonbase
