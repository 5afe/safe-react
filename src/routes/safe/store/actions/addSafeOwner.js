// @flow
import { createAction } from 'redux-actions'

export const ADD_SAFE_OWNER = 'ADD_SAFE_OWNER'

const addSafeOwner = createAction<string, *>(ADD_SAFE_OWNER)

export default addSafeOwner
