// @flow
import { type ActionType, handleActions } from 'redux-actions'

import addProvider, { ADD_PROVIDER } from '~/logic/wallets/store/actions/addProvider'
import { REMOVE_PROVIDER } from '~/logic/wallets/store/actions/removeProvider'
import { type Provider, makeProvider } from '~/logic/wallets/store/model/provider'

export const PROVIDER_REDUCER_ID = 'providers'

export type State = Provider

export default handleActions<State, Function>(
  {
    [ADD_PROVIDER]: (state: State, { payload }: ActionType<typeof addProvider>) => makeProvider(payload),
    [REMOVE_PROVIDER]: () => makeProvider(),
  },
  makeProvider(),
)
