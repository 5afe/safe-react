// @flow
import { handleActions, type ActionType } from 'redux-actions'
import { makeProvider, type Provider } from '~/logic/wallets/store/model/provider'
import addProvider, { ADD_PROVIDER } from '~/logic/wallets/store/actions/addProvider'
import { REMOVE_PROVIDER } from '~/logic/wallets/store/actions/removeProvider'

export const PROVIDER_REDUCER_ID = 'providers'

export type State = Provider

export default handleActions<State, Function>(
  {
    [ADD_PROVIDER]: (state: State, { payload }: ActionType<typeof addProvider>) => makeProvider(payload),
    [REMOVE_PROVIDER]: () => makeProvider(),
  },
  makeProvider(),
)
