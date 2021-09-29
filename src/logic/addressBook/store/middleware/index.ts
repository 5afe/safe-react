import { ADDRESS_BOOK_ACTIONS } from 'src/logic/addressBook/store/actions'
import { enhanceSnackbarForAction, getNotificationsFromTxType } from 'src/logic/notifications'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'

const watchedActions = Object.values(ADDRESS_BOOK_ACTIONS)

export const addressBookMiddleware = (store) => (next) => async (action) => {
  const handledAction = next(action)
  if (watchedActions.includes(action.type)) {
    const { dispatch } = store
    switch (action.type) {
      case ADDRESS_BOOK_ACTIONS.ADD_OR_UPDATE: {
        const { shouldAvoidUpdatesNotifications } = action.payload
        if (!shouldAvoidUpdatesNotifications) {
          const notification = getNotificationsFromTxType(TX_NOTIFICATION_TYPES.ADDRESS_BOOK_NEW_ENTRY)
          dispatch(enqueueSnackbar(enhanceSnackbarForAction(notification.afterExecution.noMoreConfirmationsNeeded)))
        }
        break
      }
      case ADDRESS_BOOK_ACTIONS.REMOVE: {
        const notification = getNotificationsFromTxType(TX_NOTIFICATION_TYPES.ADDRESS_BOOK_DELETE_ENTRY)
        dispatch(enqueueSnackbar(enhanceSnackbarForAction(notification.afterExecution.noMoreConfirmationsNeeded)))
        break
      }
      case ADDRESS_BOOK_ACTIONS.IMPORT: {
        const notification = getNotificationsFromTxType(TX_NOTIFICATION_TYPES.ADDRESS_BOOK_IMPORT_ENTRIES)
        dispatch(enqueueSnackbar(enhanceSnackbarForAction(notification.afterExecution.noMoreConfirmationsNeeded)))
        break
      }
      default:
        break
    }
  }

  return handledAction
}
