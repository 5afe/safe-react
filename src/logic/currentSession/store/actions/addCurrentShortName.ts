import { createAction } from 'redux-actions'

export const ADD_CURRENT_SHORT_NAME = 'ADD_CURRENT_SHORT_NAME'

const addCurrentShortName = createAction<string>(ADD_CURRENT_SHORT_NAME)

export default addCurrentShortName
