import EtherLogo from 'src/config/assets/token_eth.svg'
import {
  EnvironmentSettings,
  ETHEREUM_LAYER,
  ETHEREUM_NETWORK,
  NetworkConfig,
  WALLETS,
} from 'src/config/networks/network.d'
import { ETHGASSTATION_API_KEY } from 'src/utils/constants'

const baseConfig: EnvironmentSettings = {
  clientGatewayUrl: 'https://safe-client.staging.gnosisdev.com/v1',
  txServiceUrl: 'https://safe-transaction.rinkeby.staging.gnosisdev.com/api/v1',
  safeUrl: 'https://rinkeby.gnosis-safe.io/app',
  gasPriceOracles: [
    {
      url: 'https://www.gasnow.org/api/v3/gas/price?utm_source=:gnosis_safe',
      gasParameter: 'fast',
      gweiFactor: '1',
    },
    {
      url: 'https://ethgasstation.info/json/ethgasAPI.json',
      gasParameter: 'fast',
      gweiFactor: '1e8',
    },
  ],
  rpcServiceUrl: 'https://rinkeby.infura.io:443/v3',
  safeAppsRpcServiceUrl: 'https://rinkeby.infura.io:443/v3',
  networkExplorerName: 'Etherscan',
  networkExplorerUrl: 'https://rinkeby.etherscan.io',
  networkExplorerApiUrl: 'https://api-rinkeby.etherscan.io/api',
}

const rinkeby: NetworkConfig = {
  environment: {
    dev: {
      ...baseConfig,
      safeUrl: 'https://safe-team.dev.gnosisdev.com/app/',
    },
    staging: {
      ...baseConfig,
      safeUrl: 'https://safe-team-rinkeby.staging.gnosisdev.com/app/',
    },
    production: {
      ...baseConfig,
      clientGatewayUrl: 'https://safe-client.gnosis.io/v1',
      txServiceUrl: 'https://safe-transaction.rinkeby.gnosis.io/api/v1',
    },
  },
  network: {
    id: ETHEREUM_NETWORK.RINKEBY,
    backgroundColor: '#E8673C',
    textColor: '#ffffff',
    label: 'Rinkeby',
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
  disabledWallets: [WALLETS.FORTMATIC, WALLETS.LATTICE],
}

export default rinkeby
