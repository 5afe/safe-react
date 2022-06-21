import { ADDRESS_BOOK_ACTIONS } from 'src/logic/addressBook/store/actions'
import { showNotification } from 'src/logic/notifications/store/notifications'
import { NOTIFICATIONS } from 'src/logic/notifications'
import { AppReduxState } from 'src/store'
import { ThunkMiddleware } from 'redux-thunk'

export const addressBookMiddleware: ThunkMiddleware<AppReduxState> =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    const handledAction = next(action)

    switch (action.type) {
      case ADDRESS_BOOK_ACTIONS.ADD_OR_UPDATE: {
        dispatch(showNotification(NOTIFICATIONS.ADDRESS_BOOK_NEW_ENTRY_SUCCESS))
        break
      }
      case ADDRESS_BOOK_ACTIONS.REMOVE: {
        dispatch(showNotification(NOTIFICATIONS.ADDRESS_BOOK_DELETE_ENTRY_SUCCESS))
        break
      }
      case ADDRESS_BOOK_ACTIONS.IMPORT: {
        dispatch(showNotification(NOTIFICATIONS.ADDRESS_BOOK_IMPORT_ENTRIES_SUCCESS))
        break
      }
      default:
        break
    }

    return handledAction
  }
