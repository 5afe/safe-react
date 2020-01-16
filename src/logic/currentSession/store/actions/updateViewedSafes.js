// @flow
import { createAction } from 'redux-actions'

export const UPDATE_VIEWED_SAFES = 'UPDATE_VIEWED_SAFES'

const updateViewedSafes = createAction<string, *>(UPDATE_VIEWED_SAFES)

export default updateViewedSafes
