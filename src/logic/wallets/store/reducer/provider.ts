import { handleActions } from 'redux-actions'

import { ADD_PROVIDER } from 'src/logic/wallets/store/actions/addProvider'
import { REMOVE_PROVIDER } from 'src/logic/wallets/store/actions/removeProvider'
import { makeProvider, ProviderRecord, ProviderProps } from 'src/logic/wallets/store/model/provider'

export const PROVIDER_REDUCER_ID = 'providers'

export type ProviderState = ProviderRecord & { keepStorageKey?: boolean }

const providerReducer = handleActions(
  {
    [ADD_PROVIDER]: (_state: ProviderState, { payload }: { payload: ProviderProps }): ProviderState =>
      makeProvider(payload),
    [REMOVE_PROVIDER]: (): ProviderState => makeProvider(),
  },
  makeProvider(),
)

export default providerReducer
