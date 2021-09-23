import { createAction } from 'redux-actions'

export const SET_LOCAL_STORAGE_MIGRATED = 'SET_LOCAL_STORAGE_MIGRATED'

const setLocalStorageMigrated = createAction(SET_LOCAL_STORAGE_MIGRATED)

export default setLocalStorageMigrated
