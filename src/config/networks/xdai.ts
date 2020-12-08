import xDaiLogo from 'src/config/assets/token_xdai.svg'
import { EnvironmentSettings, ETHEREUM_NETWORK, FEATURES, NetworkConfig, WALLETS } from 'src/config/networks/network.d'

const baseConfig: EnvironmentSettings = {
  txServiceUrl: 'https://safe-transaction.xdai.gnosis.io/api/v1',
  safeAppsUrl: 'https://safe-apps-xdai.staging.gnosisdev.com',
  gasPrice: 1e9,
  rpcServiceUrl: 'https://dai.poa.network/',
  networkExplorerName: 'Blockscout',
  networkExplorerUrl: 'https://blockscout.com/poa/xdai',
  networkExplorerApiUrl: 'https://blockscout.com/poa/xdai/api',
}

const xDai: NetworkConfig = {
  environment: {
    staging: {
      ...baseConfig,
    },
    production: {
      ...baseConfig,
      safeAppsUrl: 'https://apps-xdai.gnosis-safe.io',
    },
  },
  network: {
    id: ETHEREUM_NETWORK.XDAI,
    backgroundColor: '#48A8A6',
    textColor: '#ffffff',
    label: 'xDai',
    isTestNet: false,
    nativeCoin: {
      address: '0x000',
      name: 'xDai',
      symbol: 'xDai',
      decimals: 18,
      logoUri: xDaiLogo,
    },
  },
  disabledWallets: [
    WALLETS.TREZOR,
    WALLETS.LEDGER,
    WALLETS.COINBASE,
    WALLETS.DAPPER,
    WALLETS.FORTMATIC,
    WALLETS.OPERA,
    WALLETS.OPERA_TOUCH,
    WALLETS.TORUS,
    WALLETS.TRUST,
    WALLETS.UNILOGIN,
    WALLETS.WALLET_CONNECT,
    WALLETS.WALLET_LINK,
    WALLETS.AUTHEREUM,
    WALLETS.LATTICE,
  ],
  disabledFeatures: [FEATURES.ENS_LOOKUP],
}

export default xDai
