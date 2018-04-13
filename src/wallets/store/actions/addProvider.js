// @flow
import { createAction } from 'redux-actions'
import { type Provider } from '~/wallets/store/model/provider'

export const ADD_PROVIDER = 'ADD_PROVIDER'

const addProvider = createAction(ADD_PROVIDER, (provider: Provider) => provider)

export default addProvider
