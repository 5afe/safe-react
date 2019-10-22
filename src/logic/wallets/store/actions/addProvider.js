// @flow
import { createAction } from 'redux-actions'
import { type Provider } from '~/logic/wallets/store/model/provider'

export const ADD_PROVIDER = 'ADD_PROVIDER'

const addProvider = createAction<string, *, *>(ADD_PROVIDER, (provider: Provider) => provider)

export default addProvider
