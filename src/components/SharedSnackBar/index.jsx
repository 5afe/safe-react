// @flow
import * as React from 'react'
import { Snackbar } from '@material-ui/core'
import SnackbarContent from '~/components/SnackbarContent'
import { SharedSnackbarConsumer } from './Context'

const SharedSnackbar = () => (
  <SharedSnackbarConsumer>
    {(value) => {
      const {
        snackbarIsOpen, message, closeSnackbar, variant,
      } = value

      return (
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          open={snackbarIsOpen}
          autoHideDuration={4000}
          onClose={closeSnackbar}
        >
          <SnackbarContent
            onClose={closeSnackbar}
            message={message}
            variant={variant}
          />
        </Snackbar>
      )
    }}
  </SharedSnackbarConsumer>
)

export default SharedSnackbar
