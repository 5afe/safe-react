import { createAction } from 'redux-actions'

export const CLEAR_CURRENT_SESSION = 'CLEAR_CURRENT_SESSION'

export const clearCurrentSession = createAction(CLEAR_CURRENT_SESSION)
