# Network Configuration

## Network configuration structure

We have currently this structure for the network configuration:

- This is the main configuration that you need to provide in order to add a new network.
```
export interface NetworkConfig {
  network: NetworkSettings
  disabledFeatures?: SafeFeatures
  disabledWallets?: Wallets
  environment: SafeEnvironments
}
```



#### NetworkSettings

- It contains the id of the ETH Network, the name of the network, information about the native coin of that network and a boolean that marks the network as a testnet or a production network.
```
export type NetworkSettings = {
  id: ETHEREUM_NETWORK,
  backgroundColor: string,
  textColor: string,
  label: string,
  isTestNet: boolean,
  nativeCoin: Token,
}
```

- Currently supported ETHEREUM_NETWORKS:

```
export enum ETHEREUM_NETWORK {
  MAINNET = 1,
  MORDEN = 2,
  ROPSTEN = 3,
  RINKEBY = 4,
  GOERLI = 5,
  KOVAN = 42,
  XDAI = 100,
  ENERGY_WEB_CHAIN = 246,
  VOLTA = 73799,
  UNKNOWN = 0,
  LOCAL = 4447,
}
```

- For the native coin, this is the structure:

```
type Token = {
  address: string
  name: string
  symbol: string
  decimals: number
  logoUri?: string
}
```


#### SafeFeatures

Its an array that contains a list of features that should be disabled for the network. It's empty as default.

```
export type SafeFeatures = FEATURES[]

export enum FEATURES {
  ERC721 = 'ERC721',
  ERC1155 = 'ERC1155',
  SAFE_APPS = 'SAFE_APPS',
  CONTRACT_INTERACTION = 'CONTRACT_INTERACTION'
}
```

#### Wallets

It is an array that contains a list of wallets that will be disabled for the network. It's empty as default.

```
export type Wallets = WALLETS[]
```

```
export enum WALLETS {
  METAMASK = 'metamask',
  WALLET_CONNECT = 'walletConnect',
  TREZOR = 'trezor',
  LEDGER = 'ledger',
  TRUST = 'trust',
  DAPPER = 'dapper',
  FORTMATIC = 'fortmatic',
  PORTIS = 'portis',
  AUTHEREUM = 'authereum',
  TORUS = 'torus',
  UNILOGIN = 'unilogin',
  COINBASE = 'coinbase',
  WALLET_LINK = 'walletLink',
  OPERA = 'opera',
  OPERA_TOUCH = 'operaTouch'
}
```

#### SafeEnviroments

If the network has different enviroments, you can add them here, otherwise you should add only the production settings

```
type SafeEnvironments = {
  dev?: EnvironmentSettings
  staging?: EnvironmentSettings
  production: EnvironmentSettings
}
```

We use a transaction service (**txServiceUrl**) for fetching the transactions and balances of the safe and also to POST messages with the created transactions, this should be provided by Gnosis.

The **networkExplorer** information is information related to the networkExplorer used for the given network (Blockscout for xDai, Etherscan for mainnet, etc). This is used for link transaction hashes and addresses to the given network explorer.
```
export type EnvironmentSettings = GasPrice & {
  txServiceUrl: string
  relayApiUrl?: string
  safeAppsUrl: string
  rpcServiceUrl: string
  networkExplorerName: string
  networkExplorerUrl: string
  networkExplorerApiUrl: string
}
```

The **gasPrice** for the network in case it's a fixed amount (like xDai), otherwise you can give an oracle we can use to fetch the current gas price
```
type GasPrice = {
  gasPrice: number
  gasPriceOracle?: GasPriceOracle
} | {
  gasPrice?: number
  // for infura there's a REST API Token required stored in: `REACT_APP_INFURA_TOKEN`
  gasPriceOracle: GasPriceOracle
}
```

```
export type GasPriceOracle = {
  url: string
  // Different gas api providers can use a different name to reflect different gas levels based on tx speed
  // For example in ethGasStation for ETHEREUM_MAINNET = safeLow | average | fast
  gasParameter: string
}
```

### Enviroment variables:

- **REACT_APP_NETWORK**: name of the used network (ex: xDai, mainnet, rinkeby)
- **REACT_APP_GOOGLE_ANALYTICS**: Used for enabling google analytics
- **REACT_APP_PORTIS_ID**: Portis ID for enabling it on given network
- **REACT_APP_FORTMATIC_KEY**: Formatic yey for given network
- **REACT_APP_BLOCKNATIVE_KEY**: Blocknative key for given network

---
## How to add a network 

1) In case that is not already supported, add the network on the **ETHEREUM_NETWORK** enum in `src/config/networks/network.d.ts`

```
export enum ETHEREUM_NETWORK {
  MAINNET = 1,
  MORDEN = 2,
  ROPSTEN = 3,
  RINKEBY = 4,
  GOERLI = 5,
  KOVAN = 42,
  XDAI = 100,
  ENERGY_WEB_CHAIN = 246,
  VOLTA = 73799,
  UNKNOWN = 0,
  LOCAL = 4447,
}
```

2) Add **env variables**:

* REACT_APP_NETWORK
* REACT_APP_GOOGLE_ANALYTICS
* REACT_APP_PORTIS_ID
* REACT_APP_FORTMATIC_KEY
* REACT_APP_BLOCKNATIVE_KEY

3) Add the **NetworkSettings** in `src/config/networks` as `<network_name>.ts`:

```
import { EnvironmentSettings, ETHEREUM_NETWORK, NetworkConfig } from 'src/config/networks/network.d'

const baseConfig: EnvironmentSettings = {
  txServiceUrl: '',
  safeAppsUrl: '',
  gasPriceOracleUrl: '',
  gasPriceOracle: {
    url: '',
    gasParameter: '',
  },
  rpcServiceUrl: '',
  networkExplorerName: '',
  networkExplorerUrl: '',
  networkExplorerApiUrl: '',
}

const rinkeby: NetworkConfig = {
  environment: {
    dev: {
      ...baseConfig,
    },
    staging: {
      ...baseConfig,
      safeAppsUrl: '',
    },
    production: {
      ...baseConfig,
      txServiceUrl: '',
      safeAppsUrl: '',
    },
  },
  network: {
    id: ETHEREUM_NETWORK.<NETWORK_NAME>,
    backgroundColor: '',
    textColor: '',
    label: '',
    isTestNet: true/false,
    nativeCoin: {
      address: '',
      name: '',
      symbol: '',
      decimals: ?,
      logoUri: '',
    },
  },
  disabledFeatures: [],
  disabledWallets: []
}

export default <NETWORK_NAME>
```

## Configuration example (xDai) - fixed gas price

1) **ETHEREUM_NETWORK**
```
export enum ETHEREUM_NETWORK {
  MAINNET = 1,
  MORDEN = 2,
  ROPSTEN = 3,
  RINKEBY = 4,
  GOERLI = 5,
  KOVAN = 42,
  XDAI = 100, -> ADDED XDAI
  ENERGY_WEB_CHAIN = 246,
  VOLTA = 73799,
  UNKNOWN = 0,
  LOCAL = 4447,
}
```

2) **Network file** (src/config/networks/xdai.ts)

```
import { ETHEREUM_NETWORK, NetworkConfig } from 'src/config/networks/network.d'

const xDai: NetworkConfig = {
  environment: {
    production: {
     txServiceUrl: 'https://safe-transaction.xdai.gnosis.io/api/v1',
     safeAppsUrl: 'https://safe-apps-xdai.staging.gnosisdev.com',
     gasPrice: 1e9,
     rpcServiceUrl: 'https://dai.poa.network/',
     networkExplorerName: 'Blockscout',
     networkExplorerUrl: 'https://blockscout.com/poa/xdai',
     networkExplorerApiUrl: 'https://blockscout.com/poa/xdai/api',
    },
  },
  network: {
    id: ETHEREUM_NETWORK.XDAI,
    backgroundColor: '#48A8A6',
    textColor: '#ffffff',
    label: 'xDai',
    isTestNet: false,
    nativeCoin: {
      address: '0x000',
      name: 'xDai',
      symbol: 'xDai',
      decimals: 18,
      logoUri: xDaiLogo,
    },
  },
  disabledWallets:[
    WALLETS.TREZOR,
    WALLETS.LEDGER
  ]
}

export default xDai
```

## Configuration example (Mainnet) - gas price retrieven by oracle


**Network file** (src/config/networks/mainnet.ts)

```
const baseConfig: EnvironmentSettings = {
  txServiceUrl: 'https://safe-transaction.mainnet.staging.gnosisdev.com/api/v1',
  safeAppsUrl: 'https://safe-apps.dev.gnosisdev.com',
  gasPriceOracle: {
    url: 'https://ethgasstation.info/json/ethgasAPI.json',
    gasParameter: 'average',
  },
  rpcServiceUrl: 'https://mainnet.infura.io:443/v3',
  networkExplorerName: 'Etherscan',
  networkExplorerUrl: 'https://etherscan.io',
  networkExplorerApiUrl: 'https://api.etherscan.io/api',
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
      txServiceUrl: 'https://safe-transaction.mainnet.gnosis.io/api/v1',
      safeAppsUrl: 'https://apps.gnosis-safe.io',
    },
  },
  network: {
    id: ETHEREUM_NETWORK.MAINNET,
    backgroundColor: '#E8E7E6',
    textColor: '#001428',
    label: 'Mainnet',
    isTestNet: false,
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
```
