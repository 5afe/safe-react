// @flow
import type { Dispatch as ReduxDispatch } from 'redux'
import { createAction } from 'redux-actions'
import { type Variant, type Message, makeMessage } from '../models'
import { hideSnackbarMessage } from './hideSnackbar'

export const SHOW_SNACKBAR_MSG = 'SHOW_SNACKBAR_MSG'

export const addSnackbarMessage = createAction(SHOW_SNACKBAR_MSG, (message: Message) => message)

function showSnackbarMsg(message: string, variant: Variant) {
  return (dispatch: ReduxDispatch<*>) => {
    const snackbarMsg = makeMessage({
      key: new Date().getTime() + Math.random(),
      content: message,
      variant,
    })
    dispatch(addSnackbarMessage(snackbarMsg))

    setTimeout(() => {
      dispatch(hideSnackbarMessage(snackbarMsg.key))
    }, 5000)
  }
}

export default showSnackbarMsg
