import EtherLogo from 'src/config/assets/token_eth.svg'
import { EnvironmentSettings, ETHEREUM_NETWORK, NetworkConfig } from 'src/config/networks/network.d'

const baseConfig: EnvironmentSettings = {
  clientGatewayUrl: 'https://safe-client.kovan.staging.gnosisdev.com/v1',
  txServiceUrl: 'https://safe-transaction.kovan.gnosisdev.com/api/v1',
  safeAppsUrl: 'https://safe-apps.dev.gnosisdev.com',
  gasPriceOracle: {
    url: 'https://ethgasstation.info/json/ethgasAPI.json',
    gasParameter: 'average',
  },
  rpcServiceUrl: 'https://kovan.infura.io:443/v3',
  networkExplorerName: 'Etherscan',
  networkExplorerUrl: 'https://kovan.etherscan.io',
  networkExplorerApiUrl: 'https://api-kovan.etherscan.io/api',
}

const kovan: NetworkConfig = {
  environment: {
    dev: {
      ...baseConfig,
    },
    staging: {
      ...baseConfig,
    },
    production: {
      ...baseConfig,
      safeAppsUrl: 'https://apps.gnosis-safe.io',
    },
  },
  network: {
    id: ETHEREUM_NETWORK.KOVAN,
    backgroundColor: '#9363fb',
    textColor: '#ffffff',
    label: 'Kovan',
    isTestNet: true,
    nativeCoin: {
      address: '0x0000000000000000000000000000000000000000',
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
      logoUri: EtherLogo,
    },
  },
}

export default kovan
