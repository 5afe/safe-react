// @flow
import type { Dispatch as ReduxDispatch } from 'redux'
import { createAction } from 'redux-actions'
import { type Variant, type Message, makeMessage } from '../models'

export const SHOW_SNACKBAR_MSG = 'SHOW_SNACKBAR_MSG'

export const addSnackbarMessage = createAction(SHOW_SNACKBAR_MSG, (message: Message) => message)

function showSnackbarMsg(message: string, variant: Variant) {
  return (dispatch: ReduxDispatch<*>) => {
    const snackbarMsg = makeMessage({
      content: message,
      variant,
    })
    dispatch(addSnackbarMessage(snackbarMsg))

    setTimeout(() => {
      hideSnackbarMessage(snackbarMsg.key)
    })
  }
}

export default showSnackbarMsg
