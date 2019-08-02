// @flow
import { createAction } from 'redux-actions'

export const HIDE_SNACKBAR_MSG = 'HIDE_SNACKBAR_MSG'

export const hideSnackbarMessage = createAction(HIDE_SNACKBAR_MSG, (key: number) => key)

export default hideSnackbarMessage
