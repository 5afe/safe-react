import { createAction } from 'redux-actions'

import { SafeRecordProps } from 'src/logic/safe/store/models/safe'

export const UPDATE_SAFE = 'UPDATE_SAFE'

export const updateSafe = createAction<Partial<SafeRecordProps>>(UPDATE_SAFE)
