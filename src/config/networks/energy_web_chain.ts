import EwcLogo from 'src/config/assets/token_ewc.svg'
import { EnvironmentSettings, ETHEREUM_NETWORK, NetworkConfig } from 'src/config/networks/network.d'

const baseConfig: EnvironmentSettings = {
  txServiceUrl: 'https://safe-transaction.ewc.gnosis.io/api/v1',  
  safeAppsUrl: 'https://safe-apps.dev.gnosisdev.com',
  gasPriceOracleUrl: 'https://station.energyweb.org',
  rpcServiceUrl: 'https://rpc.energyweb.org',
  networkExplorerName: 'Energy web explorer',
  networkExplorerUrl: 'https://explorer.energyweb.org',
  networkExplorerApiUrl: 'https://explorer.energyweb.org/api',
}

const mainnet: NetworkConfig = {
  environment: {
    dev: {
      ...baseConfig,
    },
    staging: {
      ...baseConfig,
      safeAppsUrl: 'https://safe-apps.staging.gnosisdev.com',
    },
    production: {
      ...baseConfig,
      safeAppsUrl: 'https://apps.gnosis-safe.io',
    },
  },
  network: {
    id: ETHEREUM_NETWORK.ENERGY_WEB_CHAIN,
    backgroundColor: '#A566FF',
    textColor: '#ffffff',
    label: 'EWC',
    isTestNet: false,
    nativeCoin: {
      address: '0x000',
      name: 'Energy web token',
      symbol: 'EWT',
      decimals: 18,
      logoUri: EwcLogo,
    },
  }
}

export default mainnet
