import { Action, handleActions } from 'redux-actions'

import { ChainId } from 'src/config/chain.d'
import { PROVIDER_ACTIONS } from 'src/logic/wallets/store/actions'

export type ProvidersState = {
  name: string
  hardwareWallet: boolean
  smartContractWallet: boolean
  network: ChainId
  account: string
  available: boolean
  ensDomain: string
  loaded: boolean
}

export type ProviderWalletPayload = Pick<ProvidersState, 'name' | 'hardwareWallet' | 'smartContractWallet'>
export type ProviderNetworkPayload = ProvidersState['network']
export type ProviderAccountPayload = ProvidersState['account']
export type ProviderEnsPayload = ProvidersState['ensDomain']

export type ProviderPayloads =
  | ProviderWalletPayload
  | ProviderAccountPayload
  | ProviderNetworkPayload
  | ProviderEnsPayload

const initialProviderState: ProvidersState = {
  name: '',
  hardwareWallet: false,
  smartContractWallet: false,
  account: '',
  network: '',
  ensDomain: '',
  available: false,
  loaded: false,
}

const providerFactory = (provider: ProvidersState) => {
  const { name, hardwareWallet, smartContractWallet, account, network } = provider
  const hasWallet = !!name || !!hardwareWallet || !!smartContractWallet
  return { ...provider, loaded: hasWallet && !!account && !!network }
}

export const PROVIDER_REDUCER_ID = 'providers'

const providerReducer = handleActions<ProvidersState, ProviderPayloads>(
  {
    [PROVIDER_ACTIONS.WALLET]: (state: ProvidersState, { payload }: Action<ProviderWalletPayload>) =>
      providerFactory({ ...state, ...payload }),
    [PROVIDER_ACTIONS.NETWORK]: (state: ProvidersState, { payload }: Action<ProviderNetworkPayload>) =>
      providerFactory({ ...state, network: payload }),
    [PROVIDER_ACTIONS.ACCOUNT]: (state: ProvidersState, { payload }: Action<ProviderAccountPayload>) =>
      providerFactory({ ...state, account: payload, available: !!payload }),
    [PROVIDER_ACTIONS.ENS]: (state: ProvidersState, { payload }: Action<ProviderEnsPayload>) =>
      providerFactory({ ...state, ensDomain: payload }),
  },
  initialProviderState,
)

export default providerReducer
