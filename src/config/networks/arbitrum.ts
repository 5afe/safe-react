import EtherLogo from 'src/config/assets/token_eth.svg'
import { EnvironmentSettings, ETHEREUM_NETWORK, FEATURES, NetworkConfig, WALLETS } from 'src/config/networks/network.d'

const baseConfig: EnvironmentSettings = {
  clientGatewayUrl: 'https://safe-client.arbitrum.gnosis.io/v1',
  txServiceUrl: 'https://safe-transaction.arbitrum.gnosis.io/api/v1',
  safeUrl: 'https://arbitrum.gnosis-safe.io/app',
  safeAppsUrl: 'https://safe-apps-arbitrum.staging.gnosisdev.com',
  gasPrice: 0.3e9, // TODO: Arbitrum supports the eth_gasPrice RPC method, use that instead
  rpcServiceUrl: 'https://arb1.arbitrum.io/rpc',
  networkExplorerName: 'Arbitrum explorer',
  networkExplorerUrl: 'https://explorer.arbitrum.io',
  networkExplorerApiUrl: 'https://explorer.arbitrum.io/api', // TODO: check with Arbitrum
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
      safeAppsUrl: 'https://apps-arbitrum.gnosis-safe.io',
    },
  },
  network: {
    id: ETHEREUM_NETWORK.ARBITRUM,
    backgroundColor: '#2A3245',
    textColor: '#ffffff',
    label: 'Arbitrum',
    isTestNet: false,
    nativeCoin: {
      address: '0x0000000000000000000000000000000000000000',
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
      logoUri: EtherLogo,
    },
  },
  disabledWallets: [
    WALLETS.WALLET_CONNECT,
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
  ],
  disabledFeatures: [FEATURES.DOMAIN_LOOKUP, FEATURES.SPENDING_LIMIT, FEATURES.SAFE_APPS],
}

export default arbitrum
