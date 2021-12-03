import EtherLogo from 'src/config/assets/token_eth.svg'
import {
  EnvironmentSettings,
  ETHEREUM_LAYER,
  ETHEREUM_NETWORK,
  SHORT_NAME,
  NetworkConfig,
} from 'src/config/networks/network.d'
import { WALLETS } from 'src/config/networks/network.d'
import { ETHGASSTATION_API_KEY, ETHERSCAN_API_KEY } from 'src/utils/constants'

const baseConfig: EnvironmentSettings = {
  clientGatewayUrl: 'https://safe-client.staging.gnosisdev.com/v1',
  txServiceUrl: 'https://safe-transaction.mainnet.staging.gnosisdev.com/api/v1',
  gasPriceOracles: [
    {
      url: `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${ETHERSCAN_API_KEY}`,
      gasParameter: 'FastGasPrice',
      gweiFactor: '1e9',
    },
    {
      url: `https://ethgasstation.info/json/ethgasAPI.json?api-key=${ETHGASSTATION_API_KEY}`,
      gasParameter: 'fast',
      gweiFactor: '1e8',
    },
  ],
  safeAppsRpcServiceUrl: 'https://mainnet.infura.io:443/v3',
  rpcServiceUrl: 'https://mainnet.infura.io:443/v3',
  networkExplorerName: 'Etherscan',
  networkExplorerUrl: 'https://etherscan.io',
  networkExplorerApiUrl: 'https://api.etherscan.io/api',
}

const mainnet: NetworkConfig = {
  environment: {
    test: baseConfig,
    dev: baseConfig,
    staging: baseConfig,
    production: {
      ...baseConfig,
      clientGatewayUrl: 'https://safe-client.gnosis.io/v1',
      txServiceUrl: 'https://safe-transaction.mainnet.gnosis.io/api/v1',
    },
  },
  network: {
    id: ETHEREUM_NETWORK.MAINNET,
    shortName: SHORT_NAME.MAINNET,
    backgroundColor: '#E8E7E6',
    textColor: '#001428',
    label: 'Ethereum',
    ethereumLayer: ETHEREUM_LAYER.L1,
    nativeCoin: {
      address: '0x0000000000000000000000000000000000000000',
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
      logoUri: EtherLogo,
    },
  },
  disabledWallets: [WALLETS.LATTICE],
}

export default mainnet
