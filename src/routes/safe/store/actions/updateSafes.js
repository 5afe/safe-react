// @flow
import { createAction } from 'redux-actions'

export const UPDATE_SAFES = 'UPDATE_SAFES'

const updateSafesInBatch = createAction(UPDATE_SAFES)

export default updateSafesInBatch
