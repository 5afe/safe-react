// @flow
import enqueueSnackbar from '~/logic/notifications/store/actions/enqueueSnackbar'
import closeSnackbar from '~/logic/notifications/store/actions/closeSnackbar'
import removeSnackbar from '~/logic/notifications/store/actions/removeSnackbar'

export type Actions = {
  enqueueSnackbar: typeof enqueueSnackbar,
  closeSnackbar: typeof closeSnackbar,
  removeSnackbar: typeof removeSnackbar,
}

export default {
  enqueueSnackbar,
  closeSnackbar,
  removeSnackbar,
}
