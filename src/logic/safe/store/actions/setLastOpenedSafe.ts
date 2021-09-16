import { createAction } from 'redux-actions'

export const SET_LAST_OPENED_SAFE = 'SET_LAST_OPENED_SAFE'

export const setLastOpenedSafe = createAction(SET_LAST_OPENED_SAFE, (address: string) => ({
  address,
}))
