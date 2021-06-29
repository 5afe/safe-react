import EwcLogo from 'src/config/assets/token_ewc.svg'
import { EnvironmentSettings, ETHEREUM_NETWORK, NetworkConfig, WALLETS } from 'src/config/networks/network.d'

const baseConfig: EnvironmentSettings = {
  clientGatewayUrl: 'https://safe-client.volta.gnosis.io/v1',
  txServiceUrl: 'https://safe-transaction.volta.gnosis.io/api/v1',
  safeUrl: 'https://volta.gnosis-safe.io/app',
  safeAppsUrl: 'https://safe-apps-volta.staging.gnosisdev.com',
  gasPriceOracle: {
    url: 'https://station.energyweb.org',
    gasParameter: 'standard',
  },
  rpcServiceUrl: 'https://volta-rpc.energyweb.org',
  networkExplorerName: 'Volta explorer',
  networkExplorerUrl: 'https://volta-explorer.energyweb.org',
  networkExplorerApiUrl: 'https://volta-explorer.energyweb.org/api',
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
      safeAppsUrl: 'https://apps-volta.gnosis-safe.io',
    },
  },
  network: {
    id: ETHEREUM_NETWORK.VOLTA,
    backgroundColor: '#514989',
    textColor: '#ffffff',
    label: 'Volta',
    isTestNet: true,
    nativeCoin: {
      address: '0x0000000000000000000000000000000000000000',
      name: 'Volta Token',
      symbol: 'VT',
      decimals: 18,
      logoUri: EwcLogo,
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
  ],
}

export default mainnet
