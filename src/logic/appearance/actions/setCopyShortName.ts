import { createAction } from 'redux-actions'

import { SetCopyShortNamePayload } from '../reducer/appearance'

export const SET_COPY_SHORT_NAME = 'SET_COPY_SHORT_NAME'

export const setCopyShortName = createAction<SetCopyShortNamePayload>(SET_COPY_SHORT_NAME)
