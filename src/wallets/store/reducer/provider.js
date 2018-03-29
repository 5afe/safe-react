// @flow
import { handleActions } from 'redux-actions'
import { makeProvider } from '~/wallets/store/model/provider'
import { ADD_PROVIDER } from '~/wallets/store/actions/addProvider'

export const REDUCER_ID = 'providers'

export default handleActions({
  [ADD_PROVIDER]: (state, { payload }) =>
    makeProvider(payload),
}, makeProvider())
