import EwcLogo from 'src/config/assets/token_ewc.svg'
import {
  EnvironmentSettings,
  ETHEREUM_LAYER,
  ETHEREUM_NETWORK,
  SHORT_NAME,
  NetworkConfig,
  WALLETS,
} from 'src/config/networks/network.d'

// @todo (agustin) we need to use fixed gasPrice because the oracle is not working right now and it's returning 0
// once the oracle is fixed we need to remove the fixed value
const baseConfig: EnvironmentSettings = {
  clientGatewayUrl: 'https://safe-client.gnosis.io/v1',
  txServiceUrl: 'https://safe-transaction.ewc.gnosis.io/api/v1',
  gasPriceOracles: [
    {
      url: 'https://station.energyweb.org',
      gasParameter: 'standard',
      gweiFactor: '1e9',
    },
  ],
  gasPrice: 1e6,
  rpcServiceUrl: 'https://rpc.energyweb.org',
  safeAppsRpcServiceUrl: 'https://rpc.energyweb.org',
  networkExplorerName: 'Energy web explorer',
  networkExplorerUrl: 'https://explorer.energyweb.org',
  networkExplorerApiUrl: 'https://explorer.energyweb.org/api',
}

const mainnet: NetworkConfig = {
  environment: {
    test: baseConfig,
    dev: baseConfig,
    staging: baseConfig,
    production: baseConfig,
  },
  network: {
    id: ETHEREUM_NETWORK.ENERGY_WEB_CHAIN,
    shortName: SHORT_NAME.ENERGY_WEB_CHAIN,
    backgroundColor: '#A566FF',
    textColor: '#ffffff',
    label: 'EWC',
    isTestNet: false,
    ethereumLayer: ETHEREUM_LAYER.L2,
    nativeCoin: {
      address: '0x0000000000000000000000000000000000000000',
      name: 'Energy web token',
      symbol: 'EWT',
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
    WALLETS.KEYSTONE,
  ],
}

export default mainnet
