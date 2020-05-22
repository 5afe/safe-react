import { ADD_ENTRY } from 'src/logic/addressBook/store/actions/addAddressBookEntry'
import { ADD_OR_UPDATE_ENTRY } from 'src/logic/addressBook/store/actions/addOrUpdateAddressBookEntry'
import { REMOVE_ENTRY } from 'src/logic/addressBook/store/actions/removeAddressBookEntry'
import { UPDATE_ENTRY } from 'src/logic/addressBook/store/actions/updateAddressBookEntry'
import { addressBookMapSelector } from 'src/logic/addressBook/store/selectors'
import { saveAddressBook } from 'src/logic/addressBook/utils'
import { enhanceSnackbarForAction, getNotificationsFromTxType } from 'src/logic/notifications'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'

const watchedActions = [ADD_ENTRY, REMOVE_ENTRY, UPDATE_ENTRY, ADD_OR_UPDATE_ENTRY]

const addressBookMiddleware = (store) => (next) => async (action) => {
  const handledAction = next(action)

  if (watchedActions.includes(action.type)) {
    const state = store.getState()
    const { dispatch } = store
    const addressBook = addressBookMapSelector(state)
    if (addressBook) {
      await saveAddressBook(addressBook)
    }

    switch (action.type) {
      case ADD_ENTRY: {
        const { isOwner } = action.payload.entry
        if (!isOwner) {
          const notification = getNotificationsFromTxType(TX_NOTIFICATION_TYPES.ADDRESSBOOK_NEW_ENTRY)
          dispatch(enqueueSnackbar(enhanceSnackbarForAction(notification.afterExecution.noMoreConfirmationsNeeded)))
        }
        break
      }
      case REMOVE_ENTRY: {
        const notification = getNotificationsFromTxType(TX_NOTIFICATION_TYPES.ADDRESSBOOK_DELETE_ENTRY)
        dispatch(enqueueSnackbar(enhanceSnackbarForAction(notification.afterExecution.noMoreConfirmationsNeeded)))
        break
      }
      case UPDATE_ENTRY: {
        const notification = getNotificationsFromTxType(TX_NOTIFICATION_TYPES.ADDRESSBOOK_EDIT_ENTRY)
        dispatch(enqueueSnackbar(enhanceSnackbarForAction(notification.afterExecution.noMoreConfirmationsNeeded)))
        break
      }
      default:
        break
    }
  }

  return handledAction
}

export default addressBookMiddleware
