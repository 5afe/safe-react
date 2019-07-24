// @flow
import { List } from 'immutable'
import { handleActions, type ActionType } from 'redux-actions'
import { type Message } from '../models'
import {
  addSnackbarMessage, hideSnackbarMessage, SHOW_SNACKBAR_MSG, HIDE_SNACKBAR_MSG,
} from '../actions'

export const SNACKBAR_REDUCER_ID = 'snackbar'

export type State = List<Message>

export default handleActions<State, *>(
  {
    [SHOW_SNACKBAR_MSG]: (state: State, action: ActionType<typeof addSnackbarMessage>): State => state.push(action.payload),
    [HIDE_SNACKBAR_MSG]: (state: State, action: ActionType<typeof hideSnackbarMessage>): State => state.filter(msg => msg.key !== action.payload),
  },
  List(),
)
