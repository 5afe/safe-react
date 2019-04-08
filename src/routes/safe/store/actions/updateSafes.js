// @flow
import { createAction } from 'redux-actions'

export const UPDATE_SAFES = 'UPDATE_SAFES'

const updateSafesInBatch = createAction<string, *>(UPDATE_SAFES)

export default updateSafesInBatch
