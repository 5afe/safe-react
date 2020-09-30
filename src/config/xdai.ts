import { NetworkConfig } from 'src/config/network'

const xDai: NetworkConfig = {
  network: {
    ID: 100,
    COLOR: '#48A8A6',
    LABEL: 'xDai STAKE',
    NATIVE_COIN: {
      address: '0x000',
      name: 'xDai',
      symbol: 'xDai',
      decimals: 18,
      logoUri: '',
    },
  },
  environment: {
    production: {
      TX_SERVICE_HOST: 'https://safe-transaction.xdai.gnosis.io/api/v1/',
      SAFE_APPS_URL: 'https://apps.gnosis-safe.io/',
      GAS_PRICE: 1e9,
      RPC_SERVICE_URL: 'https://rpc.xdaichain.com/',
      NETWORK_EXPLORER_URL: 'https://blockscout.com/poa/xdai/',
      NETWORK_EXPLORER_API_URL: 'https://blockscout.com/poa/xdai/api',
    },
  }
}

export default xDai
