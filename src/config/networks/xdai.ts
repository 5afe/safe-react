import { NetworkConfig } from 'src/config/networks/network.d'
import { ETHEREUM_NETWORK } from 'src/logic/wallets/getWeb3'

const xDai: NetworkConfig = {
  environment: {
    production: {
      txServiceUri: 'https://safe-transaction.xdai.gnosis.io/api/v1/',
      safeAppsUri: 'https://apps.gnosis-safe.io/',
      gasPrice: 1e9,
      rpcServiceUri: 'https://rpc.xdaichain.com/',
      networkExplorerUri: 'https://blockscout.com/poa/xdai/',
      networkExplorerApiUri: 'https://blockscout.com/poa/xdai/api',
    },
  },
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
  }
}

export default xDai
