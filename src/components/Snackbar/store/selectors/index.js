// @flow
import { type State, SNACKBAR_REDUCER_ID } from '../reducer'

export const snackbarMessagesSelector = (state: any): State => state[SNACKBAR_REDUCER_ID]