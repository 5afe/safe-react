// @flow
import { createAction } from 'redux-actions'

export const REPLACE_SAFE_OWNER = 'REPLACE_SAFE_OWNER'

const replaceSafeOwner = createAction<string, *>(REPLACE_SAFE_OWNER)

export default replaceSafeOwner
