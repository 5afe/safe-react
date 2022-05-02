import { createAction } from 'redux-actions'

export const ADD_CURRENT_SAFE_ADDRESS = 'ADD_CURRENT_SAFE_ADDRESS'

const addCurrentSafeAddress = createAction<string>(ADD_CURRENT_SAFE_ADDRESS)

export default addCurrentSafeAddress
