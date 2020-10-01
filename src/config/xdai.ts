import { NetworkConfig } from 'src/config/network'
import { ETHEREUM_NETWORK } from 'src/logic/wallets/getWeb3'

const xDai: NetworkConfig = {
  network: {
    id: ETHEREUM_NETWORK.XDAI,
    color: '#48A8A6',
    label: 'xDai STAKE',
    nativeCoin: {
      address: '0x000',
      name: 'xDai',
      symbol: 'xDai',
      decimals: 18,
      logoUri: '',
    },
  },
  environment: {
    production: {
      txServiceHost: 'https://safe-transaction.xdai.gnosis.io/api/v1/',
      safeAppsUrl: 'https://apps.gnosis-safe.io/',
      gasPrice: 1e9,
      rpcServiceUrl: 'https://rpc.xdaichain.com/',
      networkExplorerUrl: 'https://blockscout.com/poa/xdai/',
      networkExplorerApiUrl: 'https://blockscout.com/poa/xdai/api',
    },
  }
}

export default xDai
