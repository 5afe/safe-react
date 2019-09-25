// @flow
import { createAction } from 'redux-actions'

export const CLOSE_SNACKBAR = 'CLOSE_SNACKBAR'

const closeSnackbar = createAction<string, *>(CLOSE_SNACKBAR)

export default closeSnackbar
