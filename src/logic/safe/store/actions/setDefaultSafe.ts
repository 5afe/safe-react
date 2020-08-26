import { createAction } from 'redux-actions'

export const SET_DEFAULT_SAFE = 'SET_DEFAULT_SAFE'

export type SetDefaultSafe = (safe: string) => void

const setDefaultSafe: SetDefaultSafe = createAction(SET_DEFAULT_SAFE)

export default setDefaultSafe
