import { handleActions } from 'redux-actions'

import { ADD_PROVIDER } from 'src/logic/wallets/store/actions/addProvider'
import { REMOVE_PROVIDER } from 'src/logic/wallets/store/actions/removeProvider'
import { makeProvider, ProviderRecord, ProviderProps } from 'src/logic/wallets/store/model/provider'

export const PROVIDER_REDUCER_ID = 'providers'

export default handleActions(
  {
    [ADD_PROVIDER]: (state: { providers: ProviderProps }, { payload }: { payload: ProviderProps }): ProviderRecord =>
      makeProvider(payload),
    [REMOVE_PROVIDER]: (): ProviderRecord => makeProvider(),
  },
  makeProvider(),
)
