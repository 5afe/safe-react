import { Action, handleActions } from 'redux-actions'

import { ChainId } from 'src/config/chain.d'
import { PROVIDER_ACTIONS } from 'src/logic/wallets/store/actions'
import { checksumAddress } from 'src/utils/checksumAddress'

export type ProvidersState = {
  name: string
  network: ChainId
  account: string
  available: boolean
  ensDomain: string
  loaded: boolean
}

export type ProviderNamePayload = ProvidersState['name']
export type ProviderNetworkPayload = ProvidersState['network']
export type ProviderAccountPayload = ProvidersState['account']
export type ProviderEnsPayload = ProvidersState['ensDomain']

export type ProviderPayloads =
  | ProviderNamePayload
  | ProviderAccountPayload
  | ProviderNetworkPayload
  | ProviderEnsPayload

const initialProviderState: ProvidersState = {
  name: '',
  account: '',
  network: '',
  ensDomain: '',
  available: false,
  loaded: false,
}

export const PROVIDER_REDUCER_ID = 'providers'

const providerReducer = handleActions<ProvidersState, ProviderPayloads>(
  {
    [PROVIDER_ACTIONS.NAME]: (state: ProvidersState, { payload }: Action<ProviderNamePayload>) => ({
      ...state,
      name: payload,
      loaded: !!payload,
    }),
    [PROVIDER_ACTIONS.NETWORK]: (state: ProvidersState, { payload }: Action<ProviderNetworkPayload>) => ({
      ...state,
      network: payload,
    }),
    [PROVIDER_ACTIONS.ACCOUNT]: (state: ProvidersState, { payload }: Action<ProviderAccountPayload>) => ({
      ...state,
      account: payload ? checksumAddress(payload) : '',
      available: !!payload,
    }),
    [PROVIDER_ACTIONS.ENS]: (state: ProvidersState, { payload }: Action<ProviderEnsPayload>) => ({
      ...state,
      ensDomain: payload,
    }),
  },
  initialProviderState,
)

export default providerReducer
