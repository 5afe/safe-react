import { ChainInfo, RPC_AUTHENTICATION } from '@gnosis.pm/safe-react-gateway-sdk'

// Temp store is required as loading Redux store directly is an anit-pattern
type _ConfigStore = {
  chains: ChainInfo[]
}
export let _store: _ConfigStore = { chains: [] }

export const addChains = async (chains: ChainInfo[]) => {
  _store.chains = chains
}

// An empty template is required because `getChain()` uses `find()` on load
export const emptyChainInfo: ChainInfo = {
  transactionService: '',
  chainId: '',
  chainName: '',
  shortName: '',
  l2: false,
  description: '',
  rpcUri: { authentication: '' as RPC_AUTHENTICATION, value: '' },
  safeAppsRpcUri: { authentication: '' as RPC_AUTHENTICATION, value: '' },
  blockExplorerUriTemplate: {
    address: '',
    txHash: '',
    api: '',
  },
  nativeCurrency: {
    name: '',
    symbol: '',
    decimals: 0,
    logoUri: '',
  },
  theme: { textColor: '', backgroundColor: '' },
  ensRegistryAddress: '',
  gasPrice: [],
  disabledWallets: [],
  features: [],
}
