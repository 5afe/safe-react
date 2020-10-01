import EtherLogo from 'src/assets/icons/icon_etherTokens.svg'
import { EnvironmentSettings, NetworkConfig } from 'src/config/networks/network.d'
import { ETHEREUM_NETWORK } from 'src/logic/wallets/getWeb3'

const baseConfig: EnvironmentSettings = {
  txServiceUri: 'https://safe-transaction.staging.gnosisdev.com/api/v1/',
  safeAppsUri: 'https://safe-apps.dev.gnosisdev.com/',
  gasPriceOracleUri: 'https://ethgasstation.info/json/ethgasAPI.json',
  rpcServiceUri: 'https://rinkeby.infura.io:443/v3/',
  networkExplorerUri: 'https://rinkeby.etherscan.io/',
  networkExplorerApiUri: 'https://api-rinkeby.etherscan.io/api',
}

const rinkeby: NetworkConfig = {
  environment: {
    dev: {
      ...baseConfig,
    },
    staging: {
      ...baseConfig,
      safeAppsUri: 'https://safe-apps.staging.gnosisdev.com',
    },
    production: {
      ...baseConfig,
      txServiceUri: 'https://safe-transaction.rinkeby.gnosis.io/api/v1/',
      safeAppsUri: 'https://apps.gnosis-safe.io/',
    },
  },
  network: {
    id: ETHEREUM_NETWORK.RINKEBY,
    color: '#E8673C',
    label: 'Rinkeby',
    nativeCoin: {
      address: '0x000',
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
      logoUri: EtherLogo,
    },
  },
}

export default rinkeby
