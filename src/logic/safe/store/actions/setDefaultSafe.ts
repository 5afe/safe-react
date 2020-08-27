import { createAction } from 'redux-actions'
import { AnyAction } from 'redux'

export const SET_DEFAULT_SAFE = 'SET_DEFAULT_SAFE'

export type SetDefaultSafe = (safe: string) => AnyAction

const setDefaultSafe: SetDefaultSafe = createAction(SET_DEFAULT_SAFE)

export default setDefaultSafe
