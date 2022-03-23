import { createAction } from 'redux-actions'

import { SetBatchExecutePayload } from '../reducer/advanced'

export const SET_BATCH_EXECUTE = 'SET_BATCH_EXECUTE'

export const setBatchExecute = createAction<SetBatchExecutePayload>(SET_BATCH_EXECUTE)
