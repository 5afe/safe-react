// @flow
import * as React from 'react'
import { List } from 'immutable'
import { connect } from 'react-redux'
import { Snackbar } from '@material-ui/core'
import SnackbarContent from '~/components/SnackbarContent'
import { type Message } from '../store/models/index'
import { snackbarMessagesSelector } from '../store/selectors'
import { hideSnackbarMessage as hideSnackbarMsg } from '../store/actions'

type Props = {
  children: React.Node,
  hideSnackbarMessage: Function,
  messages: List<Message>,
}

function SharedSnackbar({ messages, hideSnackbarMessage, children }: Props) {
  const hideSnack = key => () => {
    hideSnackbarMessage(key)
  }

  return (
    <>
      {messages.map((snack, index) => (
        <Snackbar
          key={snack.key}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          open
          style={{
            bottom: `${(index + 1) * 60}px`,
          }}
          onClose={hideSnack(snack.key)}
        >
          <SnackbarContent onClose={hideSnack(snack.key)} message={snack.content} variant={snack.variant} />
        </Snackbar>
      ))}
      {children}
    </>
  )
}

export default connect<Object, Object, ?Function, ?Object>(
  state => ({
    messages: snackbarMessagesSelector(state),
  }),
  {
    hideSnackbarMessage: hideSnackbarMsg,
  },
)(SharedSnackbar)
