import { ChainInfo, RPC_AUTHENTICATION } from '@gnosis.pm/safe-react-gateway-sdk'
import { handleActions } from 'redux-actions'

import { ChainId } from 'src/config'
import { DEFAULT_CHAIN_ID } from 'src/utils/constants'
import { CONFIG_ACTIONS } from '../actions'

// =============================================================================
// Temp store is required as loading Redux store directly is an anit-pattern

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

export let _chains: ChainInfo[] = []

export const addChains = async (chains: ChainInfo[]) => {
  _chains = chains
}
// =============================================================================

export const CONFIG_REDUCER_ID = 'config'

export type ConfigState = {
  chainId: ChainId
}

export const initialConfigState: ConfigState = {
  chainId: DEFAULT_CHAIN_ID,
}

export type ConfigPayload = ChainId

const configReducer = handleActions<ConfigState, ConfigPayload>(
  {
    [CONFIG_ACTIONS.SET_CHAIN_ID]: (state, action) => {
      const networkId = action.payload
      return { ...state, chainId: networkId }
    },
  },
  initialConfigState,
)

export default configReducer
