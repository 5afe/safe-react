// @flow
import { handleActions, type ActionType } from 'redux-actions'
import { makeProvider, type Provider } from '~/wallets/store/model/provider'
import addProvider, { ADD_PROVIDER } from '~/wallets/store/actions/addProvider'

export const PROVIDER_REDUCER_ID = 'providers'

export type State = Provider

export default handleActions({
  [ADD_PROVIDER]: (state: State, { payload }: ActionType<typeof addProvider>) =>
    makeProvider(payload),
}, makeProvider())
