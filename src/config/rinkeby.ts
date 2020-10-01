import EtherLogo from 'src/assets/icons/icon_etherTokens.svg'
import { NetworkConfig } from 'src/config/network'
import { ETHEREUM_NETWORK } from 'src/logic/wallets/getWeb3'

const baseConfig = {
  txServiceHost: 'https://safe-transaction.staging.gnosisdev.com/api/v1/',
  safeAppsUrl: 'https://safe-apps.dev.gnosisdev.com/',
  gasPriceOracleUrl: 'https://ethgasstation.info/json/ethgasAPI.json',
  rpcServiceUrl: 'https://rinkeby.infura.io:443/v3/',
  networkExplorerUrl: 'https://rinkeby.etherscan.io/',
  networkExplorerApiUrl: 'https://api-rinkeby.etherscan.io/api',
}

const rinkeby: NetworkConfig = {
  environment: {
    dev: {
      ...baseConfig,
    }, staging: {
      ...baseConfig,
      safeAppsUrl: 'https://safe-apps.staging.gnosisdev.com',
    },
    production: {
      ...baseConfig,
      txServiceHost: 'https://safe-transaction.rinkeby.gnosis.io/api/v1/',
      safeAppsUrl: 'https://apps.gnosis-safe.io/',
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
