import EtherLogo from 'src/assets/icons/icon_etherTokens.svg'
import { EnvironmentSettings, NetworkConfig } from 'src/config/network'
import { ETHEREUM_NETWORK } from 'src/logic/wallets/getWeb3'

const baseConfig: EnvironmentSettings = {
  txServiceUri: 'https://safe-transaction.mainnet.staging.gnosisdev.com/api/v1/',
  safeAppsUri: 'https://safe-apps.dev.gnosisdev.com/',
  gasPriceOracleUri: 'https://ethgasstation.info/json/ethgasAPI.json',
  rpcServiceUri: 'https://mainnet.infura.io:443/v3/',
  networkExplorerUri: 'https://etherscan.io/',
  networkExplorerApiUri: 'https://api.etherscan.io/api',
}

const mainnet: NetworkConfig = {
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
      txServiceUri: 'https://safe-transaction.mainnet.gnosis.io/api/v1/',
      safeAppsUri: 'https://apps.gnosis-safe.io/',
    },
  },
  network: {
    id: ETHEREUM_NETWORK.MAINNET,
    color: '#E8E7E6',
    label: 'Mainnet',
    nativeCoin: {
      address: '0x000',
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
      logoUri: EtherLogo,
    },
  }
}

export default mainnet
