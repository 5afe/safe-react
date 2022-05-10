import { createAction } from 'redux-actions'

import { SetShowShortNamePayload } from '../reducer/appearance'

export const SET_SHOW_SHORT_NAME = 'SET_SHOW_SHORT_NAME'

export const setShowShortName = createAction<SetShowShortNamePayload>(SET_SHOW_SHORT_NAME)
