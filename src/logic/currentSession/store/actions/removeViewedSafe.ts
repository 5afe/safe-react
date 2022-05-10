import { createAction } from 'redux-actions'

export const REMOVE_VIEWED_SAFE = 'REMOVE_VIEWED_SAFE'

const removeViewedSafe = createAction<string>(REMOVE_VIEWED_SAFE)

export default removeViewedSafe
