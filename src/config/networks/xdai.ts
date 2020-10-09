import { EnvironmentSettings, ETHEREUM_NETWORK, NetworkConfig } from 'src/config/networks/network.d'

const baseConfig: EnvironmentSettings = {
  txServiceUrl: 'https://safe-transaction.xdai.gnosis.io/api/v1',
  safeAppsUrl: 'http://safe-apps-xdai.staging.gnosisdev.com/',
  gasPrice: 1e9,
  rpcServiceUrl: 'https://rpc.xdaichain.com',
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
      ...baseConfig
    },
  },
  network: {
    id: ETHEREUM_NETWORK.XDAI,
    backgroundColor: '#48A8A6',
    textColor: '#ffffff',
    label: 'xDai STAKE',
    nativeCoin: {
      address: '0x000',
      name: 'xDai',
      symbol: 'xDai',
      decimals: 18,
      logoUri: '',
    },
  }
}

export default xDai
