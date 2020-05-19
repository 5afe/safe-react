import { createAction } from 'redux-actions'

export const LOAD_CURRENT_SESSION = 'LOAD_CURRENT_SESSION'

const loadCurrentSession = createAction(LOAD_CURRENT_SESSION)

export default loadCurrentSession
