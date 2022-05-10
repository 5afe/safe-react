import { createAction } from 'redux-actions'

import { SafeRecordProps } from 'src/logic/safe/store/models/safe'

export const ADD_OR_UPDATE_SAFE = 'ADD_OR_UPDATE_SAFE'

export const addOrUpdateSafe = createAction<SafeRecordProps>(ADD_OR_UPDATE_SAFE)
