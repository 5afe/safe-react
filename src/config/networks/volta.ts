import EwcLogo from 'src/config/assets/token_ewc.svg'
import { EnvironmentSettings, ETHEREUM_NETWORK, NetworkConfig } from 'src/config/networks/network.d'

const baseConfig: EnvironmentSettings = {
  txServiceUrl: 'https://safe-transaction.volta.gnosis.io/api/v1',
  safeAppsUrl: 'https://safe-apps.dev.gnosisdev.com',
  gasPriceOracleUrl: 'https://station.energyweb.org',
  rpcServiceUrl: 'https://volta-rpc.energyweb.org',
  networkExplorerName: 'Volta explorer',
  networkExplorerUrl: 'https://volta-explorer.energyweb.org',
  networkExplorerApiUrl: 'https://volta-explorer.energyweb.org/api',
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
    id: ETHEREUM_NETWORK.VOLTA,
    backgroundColor: '#514989',
    textColor: '#ffffff',
    label: 'Volta',
    isTestNet: true,
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
