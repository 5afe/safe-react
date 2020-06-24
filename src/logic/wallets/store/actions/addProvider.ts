import { createAction } from 'redux-actions'

export const ADD_PROVIDER = 'ADD_PROVIDER'

const addProvider = createAction(ADD_PROVIDER, (provider) => provider)

export default addProvider
