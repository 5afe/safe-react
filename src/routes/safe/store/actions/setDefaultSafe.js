// @flow
import { createAction } from 'redux-actions'

export const SET_DEFAULT_SAFE = 'SET_DEFAULT_SAFE'

const setDefaultSafe = createAction<string, *>(SET_DEFAULT_SAFE)

export default setDefaultSafe
