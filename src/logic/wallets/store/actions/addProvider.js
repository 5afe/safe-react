//
import { createAction } from 'redux-actions'

import {} from 'src/logic/wallets/store/model/provider'

export const ADD_PROVIDER = 'ADD_PROVIDER'

const addProvider = createAction(ADD_PROVIDER, (provider) => provider)

export default addProvider
