// @flow
import { createAction } from 'redux-actions'

export const UPDATE_SAFE_THRESHOLD = 'UPDATE_SAFE_THRESHOLD'

const updateSafeThreshold = createAction<string, *>(UPDATE_SAFE_THRESHOLD)

export default updateSafeThreshold
