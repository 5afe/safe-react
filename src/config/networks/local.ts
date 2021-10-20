import EtherLogo from 'src/config/assets/token_eth.svg'
import {
  EnvironmentSettings,
  ETHEREUM_LAYER,
  ETHEREUM_NETWORK,
  SHORT_NAME,
  NetworkConfig,
} from 'src/config/networks/network.d'

const baseConfig: EnvironmentSettings = {
  clientGatewayUrl: 'http://localhost:8001/v1',
  txServiceUrl: 'http://localhost:8000/api/v1',
  gasPriceOracles: [
    {
      url: 'https://ethgasstation.info/json/ethgasAPI.json',
      gasParameter: 'fast',
      gweiFactor: '1e8',
    },
  ],
  rpcServiceUrl: 'http://localhost:4447',
  safeAppsRpcServiceUrl: 'http://localhost:4447',
  networkExplorerName: 'Etherscan',
  networkExplorerUrl: 'https://rinkeby.etherscan.io',
  networkExplorerApiUrl: 'https://api-rinkeby.etherscan.io/api',
}

const local: NetworkConfig = {
  environment: {
    test: baseConfig,
    production: baseConfig,
  },
  network: {
    id: ETHEREUM_NETWORK.LOCAL,
    shortName: SHORT_NAME.LOCAL,
    backgroundColor: '#E8673C',
    textColor: '#ffffff',
    label: 'LocalRPC',
    isTestNet: true,
    ethereumLayer: ETHEREUM_LAYER.L1,
    nativeCoin: {
      address: '0x0000000000000000000000000000000000000000',
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
      logoUri: EtherLogo,
    },
  },
}

export default local
