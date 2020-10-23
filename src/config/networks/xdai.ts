import { EnvironmentSettings, ETHEREUM_NETWORK, WALLETS, NetworkConfig } from 'src/config/networks/network.d'
import xDaiLogo from 'src/config/assets/token_xdai.svg'

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
      ...baseConfig
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
  disabledWallets:[
    WALLETS.TREZOR,
    WALLETS.LEDGER
  ]
}

export default xDai
