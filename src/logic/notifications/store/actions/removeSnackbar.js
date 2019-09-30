// @flow
import { createAction } from 'redux-actions'

export const REMOVE_SNACKBAR = 'REMOVE_SNACKBAR'

const removeSnackbar = createAction<string, *>(REMOVE_SNACKBAR)

export default removeSnackbar
