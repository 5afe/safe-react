import { createAction } from 'redux-actions'

import { SafeRecordProps } from '../models/safe'

export const ADD_OR_UPDATE_SAFE = 'ADD_OR_UPDATE_SAFE'

export const addOrUpdateSafe = createAction(ADD_OR_UPDATE_SAFE, (safe: SafeRecordProps) => ({
  safe,
}))
