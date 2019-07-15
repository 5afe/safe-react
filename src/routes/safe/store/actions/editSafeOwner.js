// @flow
import { createAction } from 'redux-actions'

export const EDIT_SAFE_OWNER = 'EDIT_SAFE_OWNER'

const editSafeOwner = createAction<string, *>(EDIT_SAFE_OWNER)

export default editSafeOwner
