// @flow
import * as React from 'react'
import { Snackbar } from '@material-ui/core'
import SnackbarContent from '~/components/SnackbarContent'

function SharedSnackbar() {
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
      <SnackbarContent onClose={closeSnackbar} message={message} variant={variant} />
    </Snackbar>
  )
}

export default SharedSnackbar
